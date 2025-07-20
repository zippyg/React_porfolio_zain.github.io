const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

// Import equation bank (simplified version)
const equations = [
  // Physics
  { latex: 'F = ma', category: 'Physics', complexity: 'simple' },
  { latex: 'E = mc²', category: 'Physics', complexity: 'simple' },
  { latex: 'E = ½mv² + V(x)', category: 'Physics', complexity: 'medium' },
  { latex: 'L = T - V', category: 'Physics', complexity: 'medium' },
  { latex: 'iℏ∂ψ/∂t = Ĥψ', category: 'Physics', complexity: 'medium' },
  { latex: '∇·E = ρ/ε₀', category: 'Physics', complexity: 'medium' },
  { latex: 'ds² = gμνdxμdxν', category: 'Physics', complexity: 'complex' },
  { latex: '∇²u = (1/c²)∂²u/∂t²', category: 'Physics', complexity: 'medium' },
  
  // Finance
  { latex: '∂V/∂t + ½σ²S²∂²V/∂S² + rS∂V/∂S - rV = 0', category: 'Finance', complexity: 'complex' },
  { latex: 'C = S₀N(d₁) - Ke⁻ʳᵀN(d₂)', category: 'Finance', complexity: 'complex' },
  { latex: 'dS = μSdt + σSdW', category: 'Finance', complexity: 'medium' },
  { latex: 'VaR_α = μ - σΦ⁻¹(α)', category: 'Finance', complexity: 'medium' },
  
  // Machine Learning
  { latex: 'θ := θ - α∇J(θ)', category: 'ML', complexity: 'simple' },
  { latex: 'σ(z) = 1/(1+e⁻ᶻ)', category: 'ML', complexity: 'simple' },
  { latex: 'softmax(zᵢ) = eᶻⁱ/Σⱼeᶻʲ', category: 'ML', complexity: 'medium' },
  { latex: 'J = -Σy·log(ŷ)', category: 'ML', complexity: 'medium' },
  
  // Math
  { latex: '∫f(x)dx', category: 'Math', complexity: 'simple' },
  { latex: '∂f/∂x', category: 'Math', complexity: 'simple' },
  { latex: '∇f = (∂f/∂x, ∂f/∂y, ∂f/∂z)', category: 'Math', complexity: 'medium' },
  { latex: 'eⁱᵖ + 1 = 0', category: 'Math', complexity: 'simple' },
  { latex: 'Σ₁^∞ 1/n² = π²/6', category: 'Math', complexity: 'medium' },
  
  // Linear Algebra
  { latex: 'Ax = b', category: 'LinAlg', complexity: 'simple' },
  { latex: 'det(A - λI) = 0', category: 'LinAlg', complexity: 'medium' },
  { latex: 'A = UΣVᵀ', category: 'LinAlg', complexity: 'medium' },
  
  // Stochastic
  { latex: 'dXₜ = μdt + σdWₜ', category: 'Stochastic', complexity: 'medium' },
  { latex: 'E[Wₛ·Wₜ] = min(s,t)', category: 'Stochastic', complexity: 'medium' }
];

const OUTPUT_DIR = path.join(__dirname, '../public/equations');
const PADDING = 6;

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

function renderEquation(equation, index) {
  try {
    // Create test canvas for measurement
    const testCanvas = createCanvas(1, 1);
    const testCtx = testCanvas.getContext('2d');
    
    const fontSize = equation.complexity === 'simple' ? 24 : 
                    equation.complexity === 'medium' ? 20 : 16;
    
    testCtx.font = `${fontSize}px Arial, sans-serif`;
    const metrics = testCtx.measureText(equation.latex);
    
    // Create canvas with proper size
    const width = Math.ceil(metrics.width + PADDING * 2);
    const height = Math.ceil(fontSize * 1.4 + PADDING * 2);
    
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');
    
    // IMPORTANT: Fill with black background first for visibility
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, width, height);
    
    // Draw green text
    ctx.fillStyle = '#22c55e';
    ctx.font = `${fontSize}px Arial, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Add glow effect
    ctx.shadowColor = '#22c55e';
    ctx.shadowBlur = 3;
    ctx.fillText(equation.latex, width / 2, height / 2);
    
    // Save
    const filename = `eq_${index}.png`;
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(path.join(OUTPUT_DIR, filename), buffer);
    
    return {
      filename,
      path: `/equations/${filename}`,
      width,
      height,
      ...equation
    };
    
  } catch (error) {
    console.error('Error rendering:', equation.latex, error);
    return null;
  }
}

// Main function
function prerenderAll() {
  console.log('Rendering equations with GREEN text on BLACK background...');
  
  const manifest = {
    equations: {},
    metadata: {
      generatedAt: new Date().toISOString(),
      totalEquations: 0
    }
  };
  
  equations.forEach((eq, i) => {
    const result = renderEquation(eq, i);
    if (result) {
      manifest.equations[`eq_${i}`] = result;
      console.log(`✓ Rendered: ${eq.latex}`);
    }
  });
  
  manifest.metadata.totalEquations = Object.keys(manifest.equations).length;
  
  // Save manifest
  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'manifest.json'),
    JSON.stringify(manifest, null, 2)
  );
  
  console.log(`\nRendered ${manifest.metadata.totalEquations} equations`);
}

prerenderAll();