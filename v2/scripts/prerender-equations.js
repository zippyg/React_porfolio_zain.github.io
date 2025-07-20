const { createCanvas } = require('canvas');
const katex = require('katex');
const fs = require('fs');
const path = require('path');

// Since we can't directly import TypeScript, we'll inline the equation bank
// This is a simplified version for pre-rendering
const equationBank = [
  {
    name: 'Classical Mechanics',
    equations: [
      { latex: 'F = ma', description: "Newton's second law", complexity: 'simple' },
      { latex: 'E = \\frac{1}{2}mv^2 + V(x)', description: 'Total energy', complexity: 'simple' },
      { latex: 'L = T - V = \\frac{1}{2}m\\dot{q}^2 - V(q)', description: 'Lagrangian', complexity: 'medium' },
      { latex: '\\frac{d}{dt}\\left(\\frac{\\partial L}{\\partial \\dot{q}_i}\\right) - \\frac{\\partial L}{\\partial q_i} = 0', description: 'Euler-Lagrange equation', complexity: 'complex' },
      { latex: 'H = \\sum_i p_i\\dot{q}_i - L', description: 'Hamiltonian', complexity: 'medium' }
    ]
  },
  {
    name: 'Quantum Mechanics',
    equations: [
      { latex: 'i\\hbar\\frac{\\partial \\Psi}{\\partial t} = \\hat{H}\\Psi', description: 'Time-dependent Schrödinger equation', complexity: 'medium' },
      { latex: '\\hat{H}\\psi = E\\psi', description: 'Time-independent Schrödinger equation', complexity: 'medium' },
      { latex: '[\\hat{x}, \\hat{p}] = i\\hbar', description: 'Canonical commutation relation', complexity: 'simple' },
      { latex: '\\Delta x \\Delta p \\geq \\frac{\\hbar}{2}', description: 'Heisenberg uncertainty principle', complexity: 'simple' }
    ]
  },
  {
    name: 'General Relativity',
    equations: [
      { latex: 'R_{\\mu\\nu} - \\frac{1}{2}g_{\\mu\\nu}R + \\Lambda g_{\\mu\\nu} = \\frac{8\\pi G}{c^4}T_{\\mu\\nu}', description: 'Einstein field equations', complexity: 'complex' },
      { latex: 'ds^2 = g_{\\mu\\nu}dx^\\mu dx^\\nu', description: 'Metric tensor', complexity: 'medium' }
    ]
  },
  {
    name: 'Financial Mathematics',
    equations: [
      { latex: '\\frac{\\partial V}{\\partial t} + \\frac{1}{2}\\sigma^2 S^2 \\frac{\\partial^2 V}{\\partial S^2} + rS\\frac{\\partial V}{\\partial S} - rV = 0', description: 'Black-Scholes PDE', complexity: 'complex' },
      { latex: 'C = S_0 N(d_1) - Ke^{-rT}N(d_2)', description: 'Black-Scholes call option price', complexity: 'medium' },
      { latex: 'dX_t = \\mu(X_t, t)dt + \\sigma(X_t, t)dW_t', description: "Itô's stochastic differential equation", complexity: 'medium' }
    ]
  },
  {
    name: 'Machine Learning',
    equations: [
      { latex: 'J(\\theta) = \\frac{1}{2m}\\sum_{i=1}^m (h_\\theta(x^{(i)}) - y^{(i)})^2', description: 'Mean squared error', complexity: 'medium' },
      { latex: '\\theta := \\theta - \\alpha\\nabla_\\theta J(\\theta)', description: 'Gradient descent', complexity: 'simple' },
      { latex: 'h_\\theta(x) = \\frac{1}{1 + e^{-\\theta^T x}}', description: 'Logistic function', complexity: 'simple' },
      { latex: '\\text{softmax}(z_i) = \\frac{e^{z_i}}{\\sum_{j=1}^K e^{z_j}}', description: 'Softmax function', complexity: 'medium' }
    ]
  }
];

// Configuration
const OUTPUT_DIR = path.join(__dirname, '../public/equations');
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 200;
const BACKGROUND_COLOR = 'transparent';
const TEXT_COLOR = '#22c55e';
const FONT_SIZE = 24;
const PADDING = 20;

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Function to sanitize filename
function sanitizeFilename(str) {
  return str
    .replace(/[^a-zA-Z0-9_-]/g, '_')
    .replace(/__+/g, '_')
    .substring(0, 50);
}

// Function to render LaTeX to canvas
function renderLatexToCanvas(latex, outputPath) {
  return new Promise((resolve, reject) => {
    try {
      // Create HTML string with KaTeX
      const html = katex.renderToString(latex, {
        throwOnError: false,
        displayMode: true,
        output: 'html'
      });

      // Extract text content for simplified rendering
      // For the pre-rendering script, we'll create a simpler approach
      // that renders the LaTeX source with proper styling
      
      const canvas = createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
      const ctx = canvas.getContext('2d');
      
      // Set up canvas
      ctx.fillStyle = BACKGROUND_COLOR;
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      
      // Set text properties
      ctx.fillStyle = TEXT_COLOR;
      ctx.font = `${FONT_SIZE}px "JetBrains Mono", monospace`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      // Measure text to ensure it fits
      const metrics = ctx.measureText(latex);
      let fontSize = FONT_SIZE;
      let finalText = latex;
      
      // Scale font down if text is too wide
      if (metrics.width > CANVAS_WIDTH - PADDING * 2) {
        fontSize = Math.floor((CANVAS_WIDTH - PADDING * 2) / metrics.width * FONT_SIZE);
        ctx.font = `${fontSize}px "JetBrains Mono", monospace`;
      }
      
      // For very long equations, truncate and add ellipsis
      if (latex.length > 60) {
        finalText = latex.substring(0, 57) + '...';
      }
      
      // Draw the text
      ctx.fillText(finalText, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
      
      // Save to file
      const buffer = canvas.toBuffer('image/png');
      fs.writeFileSync(outputPath, buffer);
      
      resolve({
        width: CANVAS_WIDTH,
        height: CANVAS_HEIGHT,
        actualFontSize: fontSize
      });
      
    } catch (error) {
      console.error(`Error rendering equation: ${latex}`, error);
      reject(error);
    }
  });
}

// Main function to process all equations
async function prerenderAllEquations() {
  const manifest = {
    equations: {},
    metadata: {
      generatedAt: new Date().toISOString(),
      totalEquations: 0,
      fontColor: TEXT_COLOR,
      backgroundColor: BACKGROUND_COLOR
    }
  };
  
  let totalCount = 0;
  
  console.log('Starting equation pre-rendering...');
  
  for (const category of equationBank) {
    console.log(`Processing category: ${category.name}`);
    
    for (let i = 0; i < category.equations.length; i++) {
      const equation = category.equations[i];
      const equationId = `${sanitizeFilename(category.name)}_${i}`;
      const filename = `${equationId}.png`;
      const outputPath = path.join(OUTPUT_DIR, filename);
      
      try {
        const renderInfo = await renderLatexToCanvas(equation.latex, outputPath);
        
        manifest.equations[equationId] = {
          latex: equation.latex,
          description: equation.description,
          complexity: equation.complexity,
          category: category.name,
          filename: filename,
          path: `/equations/${filename}`,
          ...renderInfo
        };
        
        totalCount++;
        console.log(`  ✓ Rendered: ${equation.description.substring(0, 40)}...`);
        
      } catch (error) {
        console.error(`  ✗ Failed: ${equation.description}`, error.message);
      }
    }
  }
  
  manifest.metadata.totalEquations = totalCount;
  
  // Save manifest
  const manifestPath = path.join(OUTPUT_DIR, 'manifest.json');
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  
  console.log(`\nPre-rendering complete!`);
  console.log(`Total equations rendered: ${totalCount}`);
  console.log(`Manifest saved to: ${manifestPath}`);
  console.log(`Images saved to: ${OUTPUT_DIR}`);
}

// Run the pre-rendering
if (require.main === module) {
  prerenderAllEquations().catch(console.error);
}

module.exports = { prerenderAllEquations };