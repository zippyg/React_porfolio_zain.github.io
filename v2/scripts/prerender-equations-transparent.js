const { createCanvas, registerFont } = require('canvas');
const fs = require('fs');
const path = require('path');
const katex = require('katex');

// Since we can't easily import TypeScript, let's define the full equation bank here
// This is the complete set from equation-bank.ts
const equationCategories = [
  // ==================== CLASSICAL MECHANICS ====================
  {
    name: 'Classical Mechanics',
    equations: [
      {
        latex: 'F = ma',
        description: "Newton's second law",
        complexity: 'simple'
      },
      {
        latex: 'E = \\frac{1}{2}mv^2 + V(x)',
        description: 'Total energy',
        complexity: 'simple'
      },
      {
        latex: 'L = T - V = \\frac{1}{2}m\\dot{q}^2 - V(q)',
        description: 'Lagrangian',
        complexity: 'medium'
      },
      {
        latex: '\\frac{d}{dt}\\left(\\frac{\\partial L}{\\partial \\dot{q}_i}\\right) - \\frac{\\partial L}{\\partial q_i} = 0',
        description: 'Euler-Lagrange equation',
        complexity: 'complex'
      },
      {
        latex: 'H = \\sum_i p_i\\dot{q}_i - L',
        description: 'Hamiltonian',
        complexity: 'medium'
      }
    ]
  },
  // ==================== QUANTUM MECHANICS ====================
  {
    name: 'Quantum Mechanics',
    equations: [
      {
        latex: 'i\\hbar\\frac{\\partial \\psi}{\\partial t} = \\hat{H}\\psi',
        description: 'Schrödinger equation',
        complexity: 'medium'
      },
      {
        latex: '\\hat{H} = -\\frac{\\hbar^2}{2m}\\nabla^2 + V(\\mathbf{r})',
        description: 'Hamiltonian operator',
        complexity: 'medium'
      },
      {
        latex: '[\\hat{x}, \\hat{p}] = i\\hbar',
        description: 'Canonical commutation relation',
        complexity: 'simple'
      },
      {
        latex: '\\Delta x \\Delta p \\geq \\frac{\\hbar}{2}',
        description: 'Heisenberg uncertainty principle',
        complexity: 'simple'
      },
      {
        latex: '\\langle \\psi | \\phi \\rangle = \\int \\psi^* \\phi \\, dx',
        description: 'Inner product',
        complexity: 'medium'
      }
    ]
  },
  // ==================== FINANCIAL MATHEMATICS ====================
  {
    name: 'Financial Mathematics',
    equations: [
      {
        latex: '\\frac{\\partial V}{\\partial t} + \\frac{1}{2}\\sigma^2 S^2 \\frac{\\partial^2 V}{\\partial S^2} + rS\\frac{\\partial V}{\\partial S} - rV = 0',
        description: 'Black-Scholes PDE',
        complexity: 'complex'
      },
      {
        latex: 'C = S_0 N(d_1) - Ke^{-rT}N(d_2)',
        description: 'Black-Scholes call option price',
        complexity: 'complex'
      },
      {
        latex: 'dS_t = \\mu S_t dt + \\sigma S_t dW_t',
        description: 'Geometric Brownian motion',
        complexity: 'medium'
      },
      {
        latex: 'VaR_\\alpha = \\mu - \\sigma \\Phi^{-1}(\\alpha)',
        description: 'Value at Risk',
        complexity: 'medium'
      },
      {
        latex: '\\mathbb{E}[W_s W_t] = \\min(s,t)',
        description: 'Brownian motion covariance',
        complexity: 'simple'
      }
    ]
  },
  // ==================== MACHINE LEARNING ====================
  {
    name: 'Machine Learning',
    equations: [
      {
        latex: '\\theta := \\theta - \\alpha \\nabla J(\\theta)',
        description: 'Gradient descent',
        complexity: 'simple'
      },
      {
        latex: '\\sigma(z) = \\frac{1}{1+e^{-z}}',
        description: 'Sigmoid function',
        complexity: 'simple'
      },
      {
        latex: 'J = -\\sum_i y_i \\log(\\hat{y}_i)',
        description: 'Cross-entropy loss',
        complexity: 'medium'
      },
      {
        latex: 'h_t = tanh(W_{hh}h_{t-1} + W_{hx}x_t + b_h)',
        description: 'RNN hidden state',
        complexity: 'medium'
      },
      {
        latex: '\\text{softmax}(z_i) = \\frac{e^{z_i}}{\\sum_j e^{z_j}}',
        description: 'Softmax function',
        complexity: 'medium'
      }
    ]
  },
  // ==================== GENERAL RELATIVITY ====================
  {
    name: 'General Relativity',
    equations: [
      {
        latex: 'R_{\\mu\\nu} - \\frac{1}{2}g_{\\mu\\nu}R + \\Lambda g_{\\mu\\nu} = \\frac{8\\pi G}{c^4}T_{\\mu\\nu}',
        description: 'Einstein field equations',
        complexity: 'complex'
      },
      {
        latex: 'ds^2 = g_{\\mu\\nu}dx^\\mu dx^\\nu',
        description: 'Spacetime interval',
        complexity: 'medium'
      },
      {
        latex: '\\Gamma^\\lambda_{\\mu\\nu} = \\frac{1}{2}g^{\\lambda\\rho}(\\partial_\\mu g_{\\nu\\rho} + \\partial_\\nu g_{\\mu\\rho} - \\partial_\\rho g_{\\mu\\nu})',
        description: 'Christoffel symbols',
        complexity: 'complex'
      }
    ]
  }
];

// Flatten all equations
const allEquations = [];
equationCategories.forEach(category => {
  category.equations.forEach(eq => {
    allEquations.push({
      ...eq,
      category: category.name
    });
  });
});

const OUTPUT_DIR = path.join(__dirname, '../public/equations');
const PADDING = 20; // More padding for complex equations

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Clean existing files
const existingFiles = fs.readdirSync(OUTPUT_DIR);
existingFiles.forEach(file => {
  if (file.endsWith('.png')) {
    fs.unlinkSync(path.join(OUTPUT_DIR, file));
  }
});

console.log(`Found ${allEquations.length} equations to render`);

// Size multipliers based on complexity
const sizeMultipliers = {
  simple: 1.0,
  medium: 1.2,
  complex: 1.4
};

function renderLatexToCanvas(latex, complexity = 'medium') {
  try {
    // Render LaTeX to HTML using KaTeX
    const html = katex.renderToString(latex, {
      throwOnError: false,
      displayMode: true,
      output: 'html'
    });
    
    // Base font size varies by complexity
    const baseFontSize = complexity === 'simple' ? 28 : 
                        complexity === 'medium' ? 24 : 
                        20;
    
    // Create a test canvas to measure the rendered LaTeX
    // We'll render the HTML to determine size
    // For now, estimate based on latex length and complexity
    const estimatedWidth = Math.max(200, latex.length * 12 * sizeMultipliers[complexity]);
    const estimatedHeight = baseFontSize * 2.5 * sizeMultipliers[complexity];
    
    // Create canvas with transparent background
    const width = Math.ceil(estimatedWidth + PADDING * 2);
    const height = Math.ceil(estimatedHeight + PADDING * 2);
    
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');
    
    // IMPORTANT: Do NOT fill background - leave transparent
    // Clear the canvas (transparent)
    ctx.clearRect(0, 0, width, height);
    
    // Enable antialiasing
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    
    // Set up text rendering with green color
    ctx.fillStyle = '#22c55e';
    ctx.strokeStyle = '#22c55e';
    
    // Add subtle glow effect
    ctx.shadowColor = '#22c55e';
    ctx.shadowBlur = 4;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    
    // Since we can't directly render KaTeX HTML to canvas,
    // we'll use a workaround with better font and manual rendering
    ctx.font = `${baseFontSize}px "Times New Roman", "Cambria Math", serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // For better LaTeX rendering, we need to handle special characters
    // This is a simplified version - in production you'd use a proper LaTeX-to-canvas library
    let renderedLatex = latex
      .replace(/\\alpha/g, 'α')
      .replace(/\\beta/g, 'β')
      .replace(/\\gamma/g, 'γ')
      .replace(/\\delta/g, 'δ')
      .replace(/\\epsilon/g, 'ε')
      .replace(/\\theta/g, 'θ')
      .replace(/\\lambda/g, 'λ')
      .replace(/\\mu/g, 'μ')
      .replace(/\\pi/g, 'π')
      .replace(/\\rho/g, 'ρ')
      .replace(/\\sigma/g, 'σ')
      .replace(/\\tau/g, 'τ')
      .replace(/\\phi/g, 'φ')
      .replace(/\\psi/g, 'ψ')
      .replace(/\\omega/g, 'ω')
      .replace(/\\Omega/g, 'Ω')
      .replace(/\\partial/g, '∂')
      .replace(/\\nabla/g, '∇')
      .replace(/\\infty/g, '∞')
      .replace(/\\sum/g, 'Σ')
      .replace(/\\int/g, '∫')
      .replace(/\\sqrt/g, '√')
      .replace(/\\pm/g, '±')
      .replace(/\\cdot/g, '·')
      .replace(/\\times/g, '×')
      .replace(/\\div/g, '÷')
      .replace(/\\leq/g, '≤')
      .replace(/\\geq/g, '≥')
      .replace(/\\neq/g, '≠')
      .replace(/\\approx/g, '≈')
      .replace(/\\equiv/g, '≡')
      .replace(/\\in/g, '∈')
      .replace(/\\subset/g, '⊂')
      .replace(/\\cup/g, '∪')
      .replace(/\\cap/g, '∩')
      .replace(/\\emptyset/g, '∅')
      .replace(/\\forall/g, '∀')
      .replace(/\\exists/g, '∃')
      .replace(/\\rightarrow/g, '→')
      .replace(/\\leftarrow/g, '←')
      .replace(/\\Rightarrow/g, '⇒')
      .replace(/\\Leftarrow/g, '⇐')
      .replace(/\\leftrightarrow/g, '↔')
      .replace(/\\Leftrightarrow/g, '⇔');
    
    // Draw the equation
    ctx.fillText(renderedLatex, width / 2, height / 2);
    
    return {
      canvas,
      width,
      height
    };
    
  } catch (error) {
    console.error('Error rendering LaTeX:', latex, error);
    return null;
  }
}

// Main rendering function
function renderEquation(equation, index) {
  try {
    const result = renderLatexToCanvas(equation.latex, equation.complexity);
    if (!result) return null;
    
    const { canvas, width, height } = result;
    
    // Save as PNG with transparency
    const filename = `eq_${index}.png`;
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(path.join(OUTPUT_DIR, filename), buffer);
    
    return {
      filename,
      path: `/equations/${filename}`,
      width,
      height,
      latex: equation.latex,
      category: equation.category,
      complexity: equation.complexity,
      description: equation.description
    };
    
  } catch (error) {
    console.error('Error saving equation:', equation.latex, error);
    return null;
  }
}

// Test with first 5 equations
function renderTestBatch() {
  console.log('\n=== RENDERING TEST BATCH (5 equations) ===\n');
  
  const testEquations = allEquations.slice(0, 5);
  const testManifest = {
    equations: {},
    metadata: {
      generatedAt: new Date().toISOString(),
      totalEquations: 0,
      isTestBatch: true
    }
  };
  
  testEquations.forEach((eq, i) => {
    console.log(`Rendering test equation ${i + 1}/5: ${eq.latex}`);
    const result = renderEquation(eq, i);
    if (result) {
      testManifest.equations[`eq_${i}`] = result;
      console.log(`✓ Size: ${result.width}x${result.height}px\n`);
    }
  });
  
  testManifest.metadata.totalEquations = Object.keys(testManifest.equations).length;
  
  // Save test manifest
  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'test-manifest.json'),
    JSON.stringify(testManifest, null, 2)
  );
  
  console.log('\n=== TEST BATCH COMPLETE ===');
  console.log(`Generated ${testManifest.metadata.totalEquations} test equations`);
  console.log(`\nPlease check the following files in /v2/public/equations/:`);
  console.log('- eq_0.png through eq_4.png');
  console.log('- test-manifest.json');
  console.log('\nLook for:');
  console.log('1. Green text (#22c55e) on transparent background');
  console.log('2. Readable mathematical symbols');
  console.log('3. Appropriate sizing');
  console.log('4. Subtle glow effect');
}

// Run test batch first
renderTestBatch();

console.log('\n\nOnce you verify the test equations look correct,');
console.log('we can proceed to generate all', allEquations.length, 'equations.');