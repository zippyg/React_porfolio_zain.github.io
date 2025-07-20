const mathjax = require('mathjax');
const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

// Full equation bank
const fullEquationBank = [
  // Classical Mechanics
  { latex: 'F = ma', description: "Newton's second law", complexity: 'simple', category: 'Classical Mechanics' },
  { latex: 'E = \\frac{1}{2}mv^2 + V(x)', description: 'Total energy', complexity: 'simple', category: 'Classical Mechanics' },
  { latex: 'L = T - V = \\frac{1}{2}m\\dot{q}^2 - V(q)', description: 'Lagrangian', complexity: 'medium', category: 'Classical Mechanics' },
  { latex: '\\frac{d}{dt}\\left(\\frac{\\partial L}{\\partial \\dot{q}_i}\\right) - \\frac{\\partial L}{\\partial q_i} = 0', description: 'Euler-Lagrange equation', complexity: 'complex', category: 'Classical Mechanics' },
  { latex: 'H = \\sum_i p_i\\dot{q}_i - L', description: 'Hamiltonian', complexity: 'medium', category: 'Classical Mechanics' },
  
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

class LaTeXRenderer {
  constructor(options = {}) {
    this.options = {
      color: '#22c55e',
      density: 144, // Reduced for smaller files
      scale: {
        simple: 1.5,
        medium: 1.3,
        complex: 1.1
      },
      padding: 10,
      ...options
    };
    this.MathJax = null;
  }

  async init() {
    if (!this.MathJax) {
      console.log('Initializing MathJax...');
      this.MathJax = await mathjax.init({
        loader: { load: ['input/tex', 'output/svg'] },
        tex: {
          packages: ['base', 'ams', 'noerrors', 'noundefined', 'autoload', 'configmacros']
        },
        svg: {
          fontCache: 'global'
        }
      });
      console.log('MathJax initialized successfully');
    }
    return this.MathJax;
  }

  async renderEquation(equation, index) {
    try {
      const MathJax = await this.init();
      
      // Get scale based on complexity
      const scale = this.options.scale[equation.complexity] || 1.3;
      
      // Render the LaTeX without color command (we'll add color after)
      const svg = MathJax.tex2svg(equation.latex, { display: true, scale });
      let svgString = MathJax.startup.adaptor.outerHTML(svg);
      
      // Extract just the SVG element
      const svgMatch = svgString.match(/<svg[^>]*>([\s\S]*?)<\/svg>/);
      if (!svgMatch) {
        throw new Error('Failed to extract SVG');
      }
      
      let cleanSvg = svgMatch[0];
      
      // CRITICAL: Replace currentColor with our green color
      cleanSvg = cleanSvg.replace(/currentColor/g, this.options.color);
      cleanSvg = cleanSvg.replace(/stroke="currentColor"/g, `stroke="${this.options.color}"`);
      cleanSvg = cleanSvg.replace(/fill="currentColor"/g, `fill="${this.options.color}"`);
      
      // Also replace any black colors
      cleanSvg = cleanSvg.replace(/fill="black"/g, `fill="${this.options.color}"`);
      cleanSvg = cleanSvg.replace(/stroke="black"/g, `stroke="${this.options.color}"`);
      
      // Debug: Save SVG for first equation
      if (index === 0) {
        await fs.writeFile('public/equations/debug_equation_0.svg', cleanSvg);
        console.log('  Saved debug SVG for equation 0');
      }
      
      // Convert SVG to buffer
      const svgBuffer = Buffer.from(cleanSvg);
      
      // Get metadata first
      const metadata = await sharp(svgBuffer).metadata();
      const originalWidth = metadata.width || 100;
      const originalHeight = metadata.height || 50;
      
      // Calculate final dimensions with padding
      const finalWidth = Math.ceil(originalWidth + this.options.padding * 2);
      const finalHeight = Math.ceil(originalHeight + this.options.padding * 2);
      
      // Convert to PNG with transparent background
      const buffer = await sharp(svgBuffer, { density: this.options.density })
        .resize(finalWidth, finalHeight, {
          fit: 'contain',
          background: { r: 0, g: 0, b: 0, alpha: 0 }
        })
        .png({
          compressionLevel: 9
        })
        .toBuffer();
      
      return {
        buffer,
        width: finalWidth,
        height: finalHeight,
        ...equation
      };
      
    } catch (error) {
      console.error(`Error rendering equation ${index}: ${equation.latex}`, error.message);
      return null;
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
          density: this.options.density,
          padding: this.options.padding
        }
      }
    };
    
    for (let i = 0; i < equations.length; i++) {
      const equation = equations[i];
      console.log(`\nRendering [${i + 1}/${equations.length}]: ${equation.latex}`);
      
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
    }
    
    manifest.metadata.totalEquations = results.length;
    
    // Save manifest
    await fs.writeFile(
      path.join(outputDir, 'manifest.json'),
      JSON.stringify(manifest, null, 2)
    );
    
    return results;
  }
}

// Main execution
async function main() {
  const OUTPUT_DIR = path.join(__dirname, '../public/equations');
  
  console.log('=== WORKING LaTeX to PNG Rendering ===');
  console.log('Settings:');
  console.log('- Color: #22c55e (green) via SVG replacement');
  console.log('- Background: transparent');
  console.log('- Quality: 144 DPI');
  console.log('');
  
  const renderer = new LaTeXRenderer({
    color: '#22c55e',
    density: 144,
    padding: 10
  });
  
  // Test with 5 equations first
  console.log('=== TEST BATCH (5 equations) ===');
  const testEquations = fullEquationBank.slice(0, 5);
  
  await renderer.renderBatch(testEquations, OUTPUT_DIR);
  
  console.log('\n=== TEST COMPLETE ===');
  console.log('Check these files:');
  console.log('- eq_0.png through eq_4.png');
  console.log('- debug_equation_0.svg (to verify green color in SVG)');
  console.log('- manifest.json');
  console.log('\nThe equations should now be GREEN on transparent background!');
  
  // Check if we should render all
  if (process.argv.includes('--all')) {
    console.log('\n=== RENDERING ALL EQUATIONS ===');
    
    // Import the full equation bank here
    const { getAllEquations } = require('../src/data/equation-bank.js');
    const allEquations = getAllEquations();
    
    await renderer.renderBatch(allEquations, OUTPUT_DIR);
    console.log(`\n✓ Generated ${allEquations.length} equations successfully!`);
  }
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});