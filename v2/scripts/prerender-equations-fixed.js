const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

// Configuration
const OUTPUT_DIR = path.join(__dirname, '../public/equations');
const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 120;
const TEXT_COLOR = '#22c55e';
const FONT_SIZE = 20;
const PADDING = 20;

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Simplified equation set with readable notation
const equations = [
  // Physics - Simple
  { latex: 'F = ma', display: 'F = ma', description: "Newton's second law", complexity: 'simple', category: 'Physics' },
  { latex: 'E = mc²', display: 'E = mc²', description: 'Mass-energy equivalence', complexity: 'simple', category: 'Physics' },
  { latex: 'F = kx', display: 'F = kx', description: "Hooke's law", complexity: 'simple', category: 'Physics' },
  { latex: 'PV = nRT', display: 'PV = nRT', description: 'Ideal gas law', complexity: 'simple', category: 'Physics' },
  
  // Physics - Medium
  { latex: 'E = ½mv² + V(x)', display: 'E = ½mv² + V(x)', description: 'Total energy', complexity: 'medium', category: 'Physics' },
  { latex: 'L = T - V', display: 'L = T - V', description: 'Lagrangian', complexity: 'medium', category: 'Physics' },
  { latex: 'iℏ∂ψ/∂t = Ĥψ', display: 'iℏ∂ψ/∂t = Ĥψ', description: 'Schrödinger equation', complexity: 'medium', category: 'Physics' },
  { latex: '∇·E = ρ/ε₀', display: '∇·E = ρ/ε₀', description: "Gauss's law", complexity: 'medium', category: 'Physics' },
  
  // Finance
  { latex: 'C = S₀N(d₁) - Ke⁻ʳᵀN(d₂)', display: 'C = S₀N(d₁) - Ke⁻ʳᵀN(d₂)', description: 'Black-Scholes', complexity: 'complex', category: 'Finance' },
  { latex: 'dS = μSdt + σSdW', display: 'dS = μSdt + σSdW', description: 'Geometric Brownian motion', complexity: 'medium', category: 'Finance' },
  { latex: 'VaR_α = μ - σΦ⁻¹(α)', display: 'VaR_α = μ - σΦ⁻¹(α)', description: 'Value at Risk', complexity: 'medium', category: 'Finance' },
  
  // Machine Learning
  { latex: 'θ := θ - α∇J(θ)', display: 'θ := θ - α∇J(θ)', description: 'Gradient descent', complexity: 'simple', category: 'ML' },
  { latex: 'σ(z) = 1/(1+e⁻ᶻ)', display: 'σ(z) = 1/(1+e⁻ᶻ)', description: 'Sigmoid function', complexity: 'simple', category: 'ML' },
  { latex: 'softmax(zᵢ) = eᶻⁱ/Σⱼeᶻʲ', display: 'softmax(zᵢ) = eᶻⁱ/Σⱼeᶻʲ', description: 'Softmax function', complexity: 'medium', category: 'ML' },
  
  // Mathematics
  { latex: '∫f(x)dx', display: '∫f(x)dx', description: 'Integral', complexity: 'simple', category: 'Math' },
  { latex: '∂f/∂x', display: '∂f/∂x', description: 'Partial derivative', complexity: 'simple', category: 'Math' },
  { latex: '∇f = (∂f/∂x, ∂f/∂y, ∂f/∂z)', display: '∇f = (∂f/∂x, ∂f/∂y, ∂f/∂z)', description: 'Gradient', complexity: 'medium', category: 'Math' },
  { latex: 'eⁱᵖ + 1 = 0', display: 'eⁱᵖ + 1 = 0', description: "Euler's identity", complexity: 'simple', category: 'Math' },
  
  // General Relativity
  { latex: 'Gμν = 8πTμν', display: 'Gμν = 8πTμν', description: 'Einstein field equations', complexity: 'complex', category: 'Physics' },
  { latex: 'ds² = gμνdxμdxν', display: 'ds² = gμνdxμdxν', description: 'Metric tensor', complexity: 'medium', category: 'Physics' },
  
  // Statistics
  { latex: 'P(A|B) = P(B|A)P(A)/P(B)', display: 'P(A|B) = P(B|A)P(A)/P(B)', description: "Bayes' theorem", complexity: 'medium', category: 'Stats' },
  { latex: 'μ = Σxᵢ/n', display: 'μ = Σxᵢ/n', description: 'Mean', complexity: 'simple', category: 'Stats' },
  { latex: 'σ² = Σ(xᵢ-μ)²/n', display: 'σ² = Σ(xᵢ-μ)²/n', description: 'Variance', complexity: 'simple', category: 'Stats' }
];

// Function to sanitize filename
function sanitizeFilename(str, index) {
  return `equation_${index}`;
}

// Function to render equation to canvas
function renderEquationToCanvas(equation, outputPath, index) {
  try {
    const canvas = createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
    const ctx = canvas.getContext('2d');
    
    // Clear canvas with transparent background
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    
    // Set text properties
    ctx.fillStyle = TEXT_COLOR;
    ctx.font = `${FONT_SIZE}px "Arial", sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Measure text and adjust font size if needed
    const text = equation.display;
    let fontSize = FONT_SIZE;
    ctx.font = `${fontSize}px "Arial", sans-serif`;
    let metrics = ctx.measureText(text);
    
    // Scale down if text is too wide
    while (metrics.width > CANVAS_WIDTH - PADDING * 2 && fontSize > 12) {
      fontSize -= 2;
      ctx.font = `${fontSize}px "Arial", sans-serif`;
      metrics = ctx.measureText(text);
    }
    
    // Draw the equation
    ctx.fillText(text, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
    
    // Add a subtle glow effect
    ctx.shadowColor = TEXT_COLOR;
    ctx.shadowBlur = 3;
    ctx.fillText(text, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
    
    // Save to file
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(outputPath, buffer);
    
    console.log(`✓ Rendered: ${equation.description} (${text})`);
    
    return {
      width: CANVAS_WIDTH,
      height: CANVAS_HEIGHT,
      actualFontSize: fontSize,
      textWidth: metrics.width
    };
    
  } catch (error) {
    console.error(`Error rendering equation: ${equation.description}`, error);
    throw error;
  }
}

// Main function to process all equations
async function prerenderAllEquations() {
  const manifest = {
    equations: {},
    metadata: {
      generatedAt: new Date().toISOString(),
      totalEquations: 0,
      fontColor: TEXT_COLOR,
      backgroundColor: 'transparent'
    }
  };
  
  console.log('Starting equation pre-rendering...');
  console.log(`Rendering ${equations.length} equations...`);
  
  for (let i = 0; i < equations.length; i++) {
    const equation = equations[i];
    const equationId = sanitizeFilename(equation.description, i);
    const filename = `${equationId}.png`;
    const outputPath = path.join(OUTPUT_DIR, filename);
    
    try {
      const renderInfo = renderEquationToCanvas(equation, outputPath, i);
      
      manifest.equations[equationId] = {
        latex: equation.latex,
        display: equation.display,
        description: equation.description,
        complexity: equation.complexity,
        category: equation.category,
        filename: filename,
        path: `/equations/${filename}`,
        ...renderInfo
      };
      
    } catch (error) {
      console.error(`Failed to render: ${equation.description}`, error.message);
    }
  }
  
  manifest.metadata.totalEquations = Object.keys(manifest.equations).length;
  
  // Save manifest
  const manifestPath = path.join(OUTPUT_DIR, 'manifest.json');
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  
  console.log(`\nPre-rendering complete!`);
  console.log(`Total equations rendered: ${manifest.metadata.totalEquations}`);
  console.log(`Manifest saved to: ${manifestPath}`);
  console.log(`Images saved to: ${OUTPUT_DIR}`);
}

// Run the pre-rendering
if (require.main === module) {
  prerenderAllEquations().catch(console.error);
}

module.exports = { prerenderAllEquations };