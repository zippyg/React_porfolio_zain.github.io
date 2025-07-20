const { createCanvas, loadImage, registerFont } = require('canvas');
const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = path.join(__dirname, '../public/equations');

// Import full equation bank data
const fullEquationBank = [
  // Classical Mechanics
  { latex: 'F = ma', description: "Newton's second law", complexity: 'simple', category: 'Classical Mechanics' },
  { latex: 'E = \\frac{1}{2}mv^2 + V(x)', description: 'Total energy', complexity: 'simple', category: 'Classical Mechanics' },
  { latex: 'L = T - V', description: 'Lagrangian', complexity: 'simple', category: 'Classical Mechanics' },
  { latex: 'p = mv', description: 'Momentum', complexity: 'simple', category: 'Classical Mechanics' },
  { latex: '\\tau = r \\times F', description: 'Torque', complexity: 'simple', category: 'Classical Mechanics' },
  
  // Quantum Mechanics  
  { latex: 'E = \\hbar\\omega', description: 'Photon energy', complexity: 'simple', category: 'Quantum Mechanics' },
  { latex: '\\Delta x \\Delta p \\geq \\frac{\\hbar}{2}', description: 'Uncertainty principle', complexity: 'medium', category: 'Quantum Mechanics' },
  { latex: 'i\\hbar\\frac{\\partial\\psi}{\\partial t} = \\hat{H}\\psi', description: 'Schrödinger equation', complexity: 'medium', category: 'Quantum Mechanics' },
  { latex: '|\\psi|^2 = \\rho', description: 'Probability density', complexity: 'simple', category: 'Quantum Mechanics' },
  
  // Financial Mathematics
  { latex: 'dS_t = \\mu S_t dt + \\sigma S_t dW_t', description: 'Geometric Brownian motion', complexity: 'medium', category: 'Finance' },
  { latex: 'C = S_0 N(d_1) - Ke^{-rT}N(d_2)', description: 'Black-Scholes call', complexity: 'complex', category: 'Finance' },
  { latex: 'VaR = \\mu - \\sigma\\Phi^{-1}(\\alpha)', description: 'Value at Risk', complexity: 'medium', category: 'Finance' },
  { latex: '\\rho = \\frac{\\text{Cov}(X,Y)}{\\sigma_X\\sigma_Y}', description: 'Correlation', complexity: 'medium', category: 'Finance' },
  
  // Machine Learning
  { latex: '\\theta := \\theta - \\alpha\\nabla J(\\theta)', description: 'Gradient descent', complexity: 'simple', category: 'ML' },
  { latex: '\\sigma(z) = \\frac{1}{1+e^{-z}}', description: 'Sigmoid', complexity: 'simple', category: 'ML' },
  { latex: 'J = -\\sum y\\log(\\hat{y})', description: 'Cross-entropy', complexity: 'medium', category: 'ML' },
  
  // Mathematics
  { latex: '\\nabla \\times F = 0', description: 'Curl-free field', complexity: 'simple', category: 'Math' },
  { latex: '\\oint_C F \\cdot dr = 0', description: 'Conservative field', complexity: 'medium', category: 'Math' },
  { latex: 'e^{i\\pi} + 1 = 0', description: "Euler's identity", complexity: 'simple', category: 'Math' },
  { latex: '\\sum_{n=1}^{\\infty} \\frac{1}{n^2} = \\frac{\\pi^2}{6}', description: 'Basel problem', complexity: 'medium', category: 'Math' }
];

// Clean directory
if (fs.existsSync(OUTPUT_DIR)) {
  const files = fs.readdirSync(OUTPUT_DIR);
  files.forEach(file => {
    if (file.startsWith('eq_') && file.endsWith('.png')) {
      fs.unlinkSync(path.join(OUTPUT_DIR, file));
    }
  });
}

// Convert LaTeX to displayable Unicode text
function latexToUnicode(latex) {
  return latex
    // Fractions
    .replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '($1/$2)')
    // Greek letters
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
    .replace(/\\Phi/g, 'Φ')
    // Operators
    .replace(/\\partial/g, '∂')
    .replace(/\\nabla/g, '∇')
    .replace(/\\times/g, '×')
    .replace(/\\cdot/g, '·')
    .replace(/\\int/g, '∫')
    .replace(/\\oint/g, '∮')
    .replace(/\\sum/g, 'Σ')
    .replace(/\\infty/g, '∞')
    .replace(/\\hbar/g, 'ℏ')
    .replace(/\\geq/g, '≥')
    .replace(/\\leq/g, '≤')
    // Special
    .replace(/\\hat\{([^}]+)\}/g, '$1̂')
    // Subscripts/Superscripts (basic)
    .replace(/\^2/g, '²')
    .replace(/\^3/g, '³')
    .replace(/_0/g, '₀')
    .replace(/_1/g, '₁')
    .replace(/_2/g, '₂')
    .replace(/_t/g, 'ₜ')
    .replace(/_i/g, 'ᵢ')
    .replace(/_X/g, 'ₓ')
    .replace(/_Y/g, 'ᵧ')
    // Clean up
    .replace(/\{/g, '')
    .replace(/\}/g, '')
    .replace(/\\/g, ' ')
    .trim();
}

// Render equation with workaround for color issues
function renderEquation(equation, index) {
  try {
    // Convert LaTeX to Unicode
    const displayText = latexToUnicode(equation.latex);
    
    // Font size based on complexity
    const fontSize = equation.complexity === 'simple' ? 36 : 
                    equation.complexity === 'medium' ? 32 : 
                    28;
    
    // Measure text
    const tempCanvas = createCanvas(1, 1);
    const tempCtx = tempCanvas.getContext('2d');
    tempCtx.font = `bold ${fontSize}px Arial, sans-serif`;
    const metrics = tempCtx.measureText(displayText);
    
    // Create properly sized canvas with padding
    const padding = 20;
    const width = Math.ceil(metrics.width) + padding * 2;
    const height = fontSize * 1.5 + padding * 2;
    
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');
    
    // WORKAROUND: Since colors aren't working, we'll create equations with:
    // 1. Black background
    // 2. White text
    // 3. Then we'll explain how to invert in CSS
    
    // Fill black background
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, width, height);
    
    // Draw white text with glow
    ctx.font = `bold ${fontSize}px Arial, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Add green-tinted glow (even if it renders white)
    ctx.shadowColor = '#ffffff';
    ctx.shadowBlur = 3;
    
    // Draw white text
    ctx.fillStyle = '#ffffff';
    ctx.fillText(displayText, width / 2, height / 2);
    
    // Save
    const filename = `eq_${index}.png`;
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(path.join(OUTPUT_DIR, filename), buffer);
    
    return {
      filename,
      width,
      height,
      latex: equation.latex,
      displayText,
      complexity: equation.complexity,
      category: equation.category,
      description: equation.description
    };
    
  } catch (error) {
    console.error(`Error rendering equation ${index}:`, error);
    return null;
  }
}

// Generate test batch first
console.log('=== GENERATING EQUATIONS WITH WORKAROUND ===');
console.log('Due to canvas color issues, generating:');
console.log('- Black background with white text');
console.log('- Will use CSS filters to invert and colorize\n');

const testBatch = fullEquationBank.slice(0, 5);
const testResults = [];

console.log('Generating 5 test equations...\n');
testBatch.forEach((eq, i) => {
  console.log(`[${i+1}/5] ${eq.latex}`);
  const result = renderEquation(eq, i);
  if (result) {
    testResults.push(result);
    console.log(`  ✓ ${result.displayText} (${result.width}x${result.height}px)\n`);
  }
});

// Save test manifest
const testManifest = {
  equations: testResults,
  metadata: {
    generatedAt: new Date().toISOString(),
    totalEquations: testResults.length,
    renderSettings: {
      background: 'black',
      textColor: 'white',
      cssRequired: 'filter: invert(1) hue-rotate(120deg) brightness(1.2);'
    }
  }
};

fs.writeFileSync(
  path.join(OUTPUT_DIR, 'manifest.json'),
  JSON.stringify(testManifest, null, 2)
);

console.log('=== WORKAROUND SOLUTION ===');
console.log('Since the canvas library has color rendering issues, the equations are:');
console.log('1. White text on black background');
console.log('2. To make them green on transparent, use this CSS filter:');
console.log('   filter: invert(1) hue-rotate(120deg) brightness(1.2);');
console.log('\nThis will:');
console.log('- Invert colors (black→white, white→black)');
console.log('- Rotate hue to green');
console.log('- Adjust brightness');
console.log('\nPlease verify the test equations before generating all 168.');