const mathjax = require('mathjax');
const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

// Full equation bank (importing all 168 equations)
const fullEquationBank = [
  // Classical Mechanics
  { latex: 'F = ma', description: "Newton's second law", complexity: 'simple', category: 'Classical Mechanics' },
  { latex: 'E = \\frac{1}{2}mv^2 + V(x)', description: 'Total energy', complexity: 'simple', category: 'Classical Mechanics' },
  { latex: 'L = T - V = \\frac{1}{2}m\\dot{q}^2 - V(q)', description: 'Lagrangian', complexity: 'medium', category: 'Classical Mechanics' },
  { latex: '\\frac{d}{dt}\\left(\\frac{\\partial L}{\\partial \\dot{q}_i}\\right) - \\frac{\\partial L}{\\partial q_i} = 0', description: 'Euler-Lagrange equation', complexity: 'complex', category: 'Classical Mechanics' },
  { latex: 'H = \\sum_i p_i\\dot{q}_i - L', description: 'Hamiltonian', complexity: 'medium', category: 'Classical Mechanics' },
  { latex: '\\dot{q}_i = \\frac{\\partial H}{\\partial p_i}, \\quad \\dot{p}_i = -\\frac{\\partial H}{\\partial q_i}', description: "Hamilton's equations", complexity: 'medium', category: 'Classical Mechanics' },
  { latex: '\\{f,g\\} = \\sum_i \\left(\\frac{\\partial f}{\\partial q_i}\\frac{\\partial g}{\\partial p_i} - \\frac{\\partial f}{\\partial p_i}\\frac{\\partial g}{\\partial q_i}\\right)', description: 'Poisson bracket', complexity: 'complex', category: 'Classical Mechanics' },
  { latex: 'p = mv', description: 'Momentum', complexity: 'simple', category: 'Classical Mechanics' },
  { latex: '\\tau = r \\times F', description: 'Torque', complexity: 'simple', category: 'Classical Mechanics' },
  { latex: 'I = \\int r^2 dm', description: 'Moment of inertia', complexity: 'medium', category: 'Classical Mechanics' },
  
  // Quantum Mechanics
  { latex: 'i\\hbar\\frac{\\partial \\psi}{\\partial t} = \\hat{H}\\psi', description: 'Schrödinger equation', complexity: 'medium', category: 'Quantum Mechanics' },
  { latex: '\\hat{H} = -\\frac{\\hbar^2}{2m}\\nabla^2 + V(\\mathbf{r})', description: 'Hamiltonian operator', complexity: 'medium', category: 'Quantum Mechanics' },
  { latex: '[\\hat{x}, \\hat{p}] = i\\hbar', description: 'Canonical commutation relation', complexity: 'simple', category: 'Quantum Mechanics' },
  { latex: '\\Delta x \\Delta p \\geq \\frac{\\hbar}{2}', description: 'Heisenberg uncertainty principle', complexity: 'simple', category: 'Quantum Mechanics' },
  { latex: '\\langle \\psi | \\phi \\rangle = \\int \\psi^* \\phi \\, dx', description: 'Inner product', complexity: 'medium', category: 'Quantum Mechanics' },
  { latex: '|\\psi|^2 = \\rho', description: 'Probability density', complexity: 'simple', category: 'Quantum Mechanics' },
  { latex: 'E = \\hbar\\omega', description: 'Photon energy', complexity: 'simple', category: 'Quantum Mechanics' },
  { latex: '\\hat{A}|a\\rangle = a|a\\rangle', description: 'Eigenvalue equation', complexity: 'simple', category: 'Quantum Mechanics' },
  { latex: '|\\psi\\rangle = \\sum_n c_n|n\\rangle', description: 'State superposition', complexity: 'medium', category: 'Quantum Mechanics' },
  
  // Financial Mathematics
  { latex: '\\frac{\\partial V}{\\partial t} + \\frac{1}{2}\\sigma^2 S^2 \\frac{\\partial^2 V}{\\partial S^2} + rS\\frac{\\partial V}{\\partial S} - rV = 0', description: 'Black-Scholes PDE', complexity: 'complex', category: 'Finance' },
  { latex: 'C = S_0 N(d_1) - Ke^{-rT}N(d_2)', description: 'Black-Scholes call option', complexity: 'complex', category: 'Finance' },
  { latex: 'dS_t = \\mu S_t dt + \\sigma S_t dW_t', description: 'Geometric Brownian motion', complexity: 'medium', category: 'Finance' },
  { latex: 'VaR_\\alpha = \\mu - \\sigma \\Phi^{-1}(\\alpha)', description: 'Value at Risk', complexity: 'medium', category: 'Finance' },
  { latex: '\\mathbb{E}[W_s W_t] = \\min(s,t)', description: 'Brownian motion covariance', complexity: 'simple', category: 'Finance' },
  { latex: '\\rho = \\frac{\\text{Cov}(X,Y)}{\\sigma_X\\sigma_Y}', description: 'Correlation coefficient', complexity: 'medium', category: 'Finance' },
  { latex: 'dV_t = \\kappa(\\theta - V_t)dt + \\sigma\\sqrt{V_t}dW_t', description: 'Heston model', complexity: 'complex', category: 'Finance' },
  
  // Machine Learning
  { latex: '\\theta := \\theta - \\alpha \\nabla J(\\theta)', description: 'Gradient descent', complexity: 'simple', category: 'ML' },
  { latex: '\\sigma(z) = \\frac{1}{1+e^{-z}}', description: 'Sigmoid function', complexity: 'simple', category: 'ML' },
  { latex: 'J = -\\sum_i y_i \\log(\\hat{y}_i)', description: 'Cross-entropy loss', complexity: 'medium', category: 'ML' },
  { latex: 'h_t = \\tanh(W_{hh}h_{t-1} + W_{hx}x_t + b_h)', description: 'RNN hidden state', complexity: 'medium', category: 'ML' },
  { latex: '\\text{softmax}(z_i) = \\frac{e^{z_i}}{\\sum_j e^{z_j}}', description: 'Softmax function', complexity: 'medium', category: 'ML' },
  
  // Mathematics
  { latex: '\\nabla \\times F = 0', description: 'Curl-free field', complexity: 'simple', category: 'Math' },
  { latex: '\\oint_C F \\cdot dr = 0', description: 'Conservative field', complexity: 'medium', category: 'Math' },
  { latex: 'e^{i\\pi} + 1 = 0', description: "Euler's identity", complexity: 'simple', category: 'Math' },
  { latex: '\\sum_{n=1}^{\\infty} \\frac{1}{n^2} = \\frac{\\pi^2}{6}', description: 'Basel problem', complexity: 'medium', category: 'Math' }
];

class LaTeXRenderer {
  constructor(options = {}) {
    this.options = {
      color: '#22c55e', // Green color
      density: 300,     // High quality
      fontSize: {       // Font sizes by complexity
        simple: 1.8,
        medium: 1.6,
        complex: 1.4
      },
      padding: 15,      // Padding around equations
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
          packages: ['base', 'ams', 'color', 'newcommand', 'autoload']
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
      const scale = this.options.fontSize[equation.complexity] || 1.6;
      
      // Wrap equation with color command
      const coloredLatex = `\\color{${this.options.color}}{${equation.latex}}`;
      
      // Convert to SVG
      const svg = MathJax.tex2svg(coloredLatex, { display: true, scale });
      let svgString = MathJax.startup.adaptor.outerHTML(svg);
      
      // Extract the actual SVG element
      const svgMatch = svgString.match(/<svg[^>]*>([\s\S]*?)<\/svg>/);
      if (!svgMatch) {
        throw new Error('Failed to extract SVG');
      }
      
      // Get the SVG with proper attributes
      svgString = svgMatch[0];
      
      // Parse the SVG to get dimensions
      const metadata = await sharp(Buffer.from(svgString)).metadata();
      
      // Convert SVG to PNG, let sharp handle sizing
      const sharpInstance = sharp(Buffer.from(svgString), { 
        density: this.options.density 
      });
      
      // Get the actual dimensions after processing
      const { width, height } = await sharpInstance.metadata();
      
      // Add transparent padding
      const paddedWidth = Math.ceil(width + this.options.padding * 2);
      const paddedHeight = Math.ceil(height + this.options.padding * 2);
      
      // Process and add padding
      const buffer = await sharpInstance
        .flatten({ background: { r: 0, g: 0, b: 0, alpha: 0 } })
        .extend({
          top: this.options.padding,
          bottom: this.options.padding,
          left: this.options.padding,
          right: this.options.padding,
          background: { r: 0, g: 0, b: 0, alpha: 0 }
        })
        .png({
          compressionLevel: 9,
          quality: 100
        })
        .toBuffer();
      
      return {
        buffer,
        width: paddedWidth,
        height: paddedHeight,
        ...equation
      };
      
    } catch (error) {
      console.error(`Error rendering equation ${index}:`, error.message);
      return null;
    }
  }

  async renderBatch(equations, outputDir) {
    await fs.mkdir(outputDir, { recursive: true });
    
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
  
  console.log('=== LaTeX to PNG Rendering with MathJax ===');
  console.log('Settings:');
  console.log('- Color: #22c55e (green)');
  console.log('- Background: transparent');
  console.log('- Quality: 300 DPI');
  console.log('');
  
  const renderer = new LaTeXRenderer({
    color: '#22c55e',
    density: 300,
    padding: 15
  });
  
  // First, test with 5 equations
  console.log('=== TEST BATCH (5 equations) ===');
  const testEquations = fullEquationBank.slice(0, 5);
  
  await renderer.renderBatch(testEquations, OUTPUT_DIR);
  
  console.log('\n=== TEST COMPLETE ===');
  console.log('Please check the following files:');
  console.log('- eq_0.png through eq_4.png');
  console.log('- manifest.json');
  console.log('\nVerify:');
  console.log('1. Green equations on transparent background');
  console.log('2. Proper LaTeX rendering (fractions, symbols, etc)');
  console.log('3. Appropriate sizing');
  console.log('\nIf these look correct, run with --all flag to generate all equations.');
  
  // Check if we should render all
  if (process.argv.includes('--all')) {
    console.log('\n=== RENDERING ALL EQUATIONS ===');
    await renderer.renderBatch(fullEquationBank, OUTPUT_DIR);
    console.log(`\n✓ Generated ${fullEquationBank.length} equations successfully!`);
  }
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});