const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const path = require('path');

// Full equation bank
const fullEquationBank = [
  // Classical Mechanics
  { latex: 'F = ma', description: "Newton's second law", complexity: 'simple', category: 'Classical Mechanics' },
  { latex: 'E = \\frac{1}{2}mv^2 + V(x)', description: 'Total energy', complexity: 'simple', category: 'Classical Mechanics' },
  { latex: 'L = T - V = \\frac{1}{2}m\\dot{q}^2 - V(q)', description: 'Lagrangian', complexity: 'medium', category: 'Classical Mechanics' },
  { latex: '\\frac{d}{dt}\\left(\\frac{\\partial L}{\\partial \\dot{q}_i}\\right) - \\frac{\\partial L}{\\partial q_i} = 0', description: 'Euler-Lagrange equation', complexity: 'complex', category: 'Classical Mechanics' },
  { latex: 'H = \\sum_{i} p_i\\dot{q}_i - L', description: 'Hamiltonian', complexity: 'medium', category: 'Classical Mechanics' },
  
  // Quantum Mechanics
  { latex: 'i\\hbar\\frac{\\partial \\psi}{\\partial t} = \\hat{H}\\psi', description: 'Schrödinger equation', complexity: 'medium', category: 'Quantum Mechanics' },
  { latex: '\\Delta x \\Delta p \\geq \\frac{\\hbar}{2}', description: 'Heisenberg uncertainty principle', complexity: 'simple', category: 'Quantum Mechanics' },
  { latex: '|\\psi|^2 = \\rho', description: 'Probability density', complexity: 'simple', category: 'Quantum Mechanics' },
  
  // Financial Mathematics
  { latex: 'dS_t = \\mu S_t dt + \\sigma S_t dW_t', description: 'Geometric Brownian motion', complexity: 'medium', category: 'Finance' },
  { latex: 'C = S_0 N(d_1) - Ke^{-rT}N(d_2)', description: 'Black-Scholes call', complexity: 'complex', category: 'Finance' },
  
  // Machine Learning
  { latex: '\\theta := \\theta - \\alpha\\nabla J(\\theta)', description: 'Gradient descent', complexity: 'simple', category: 'ML' },
  { latex: '\\sigma(z) = \\frac{1}{1+e^{-z}}', description: 'Sigmoid', complexity: 'simple', category: 'ML' }
];

class PuppeteerRenderer {
  constructor(options = {}) {
    this.options = {
      color: '#22c55e',
      fontSize: {
        simple: 24,
        medium: 20,
        complex: 18
      },
      padding: 10,
      ...options
    };
    this.browser = null;
  }

  async init() {
    if (!this.browser) {
      console.log('Launching Puppeteer browser...');
      this.browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
      console.log('Browser launched successfully');
    }
    return this.browser;
  }

  async renderEquation(equation, index) {
    const browser = await this.init();
    const page = await browser.newPage();
    
    try {
      const fontSize = this.options.fontSize[equation.complexity] || 20;
      
      // Create HTML with KaTeX
      const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css">
          <script src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js"></script>
          <style>
            body {
              margin: 0;
              padding: ${this.options.padding}px;
              background: transparent;
              display: inline-block;
            }
            #equation {
              color: ${this.options.color};
              font-size: ${fontSize}px;
              display: inline-block;
              text-shadow: 0 0 3px ${this.options.color}40;
            }
          </style>
        </head>
        <body>
          <div id="equation"></div>
          <script>
            // Properly escape the LaTeX for JavaScript
            const latex = ${JSON.stringify(equation.latex)};
            katex.render(latex, document.getElementById("equation"), {
              displayMode: true,
              throwOnError: false,
              strict: false,
              trust: true
            });
            // Signal that rendering is complete
            document.getElementById("equation").setAttribute("data-rendered", "true");
          </script>
        </body>
        </html>
      `;
      
      await page.setContent(html, { waitUntil: 'networkidle0' });
      
      // Wait for rendering to complete
      await page.waitForSelector('#equation[data-rendered="true"]', { timeout: 5000 });
      
      // Get the bounding box of the rendered equation
      const boundingBox = await page.evaluate(() => {
        const element = document.getElementById('equation');
        const rect = element.getBoundingClientRect();
        return {
          x: rect.x,
          y: rect.y,
          width: Math.ceil(rect.width),
          height: Math.ceil(rect.height)
        };
      });
      
      // Add padding to dimensions
      const width = boundingBox.width + this.options.padding * 2;
      const height = boundingBox.height + this.options.padding * 2;
      
      // Set viewport to exact size needed
      await page.setViewport({
        width: width,
        height: height,
        deviceScaleFactor: 2 // For higher quality
      });
      
      // Take screenshot
      const buffer = await page.screenshot({
        omitBackground: true,
        type: 'png'
      });
      
      return {
        buffer,
        width,
        height,
        ...equation
      };
      
    } finally {
      await page.close();
    }
  }

  async renderBatch(equations, outputDir) {
    await fs.mkdir(outputDir, { recursive: true });
    
    // Clean existing files
    const existingFiles = await fs.readdir(outputDir);
    for (const file of existingFiles) {
      if (file.startsWith('eq_') && file.endsWith('.png')) {
        await fs.unlink(path.join(outputDir, file));
      }
    }
    
    const results = [];
    const manifest = {
      equations: {},
      metadata: {
        generatedAt: new Date().toISOString(),
        totalEquations: 0,
        renderSettings: {
          color: this.options.color,
          method: 'puppeteer-katex'
        }
      }
    };
    
    for (let i = 0; i < equations.length; i++) {
      const equation = equations[i];
      console.log(`\nRendering [${i + 1}/${equations.length}]: ${equation.latex}`);
      
      try {
        const result = await this.renderEquation(equation, i);
        if (result) {
          const filename = `eq_${i}.png`;
          const outputPath = path.join(outputDir, filename);
          
          await fs.writeFile(outputPath, result.buffer);
          console.log(`  ✓ Saved: ${filename} (${result.width}x${result.height}px)`);
          console.log(`  ✓ Category: ${result.category}, Complexity: ${result.complexity}`);
          
          manifest.equations[`eq_${i}`] = {
            filename,
            path: `/equations/${filename}`,
            width: result.width,
            height: result.height,
            latex: result.latex,
            description: result.description,
            complexity: result.complexity,
            category: result.category
          };
          
          results.push(result);
        }
      } catch (error) {
        console.error(`  ✗ Error: ${error.message}`);
      }
    }
    
    manifest.metadata.totalEquations = results.length;
    
    // Save manifest
    await fs.writeFile(
      path.join(outputDir, 'manifest.json'),
      JSON.stringify(manifest, null, 2)
    );
    
    return results;
  }

  async close() {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }
}

// Main execution
async function main() {
  const OUTPUT_DIR = path.join(__dirname, '../public/equations');
  
  console.log('=== Puppeteer + KaTeX Rendering ===');
  console.log('This approach uses a real browser to render LaTeX properly');
  console.log('Settings:');
  console.log('- Color: #22c55e (green)');
  console.log('- Background: transparent');
  console.log('- High quality: 2x device scale');
  console.log('');
  
  const renderer = new PuppeteerRenderer({
    color: '#22c55e',
    padding: 10
  });
  
  try {
    // Test with 5 equations first
    console.log('=== TEST BATCH (5 equations) ===');
    const testEquations = fullEquationBank.slice(0, 5);
    
    await renderer.renderBatch(testEquations, OUTPUT_DIR);
    
    console.log('\n=== TEST COMPLETE ===');
    console.log('Check these files:');
    console.log('- eq_0.png through eq_4.png');
    console.log('- manifest.json');
    console.log('\nThe equations should now be properly rendered with KaTeX!');
    console.log('Green color, transparent background, proper math notation.');
    
    // Check if we should render all
    if (process.argv.includes('--all')) {
      console.log('\n=== RENDERING ALL EQUATIONS ===');
      
      // Import the full equation bank
      const { getAllEquations } = require('../src/data/equation-bank.js');
      const allEquations = getAllEquations();
      
      await renderer.renderBatch(allEquations, OUTPUT_DIR);
      console.log(`\n✓ Generated ${allEquations.length} equations successfully!`);
    }
  } finally {
    await renderer.close();
  }
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});