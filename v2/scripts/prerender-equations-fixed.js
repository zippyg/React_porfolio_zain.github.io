const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

// Test equations
const testEquations = [
  { latex: 'F = ma', complexity: 'simple' },
  { latex: 'E = mc²', complexity: 'simple' },
  { latex: 'i\\hbar\\frac{\\partial\\psi}{\\partial t} = \\hat{H}\\psi', complexity: 'medium' },
  { latex: '\\nabla \\cdot E = \\frac{\\rho}{\\epsilon_0}', complexity: 'medium' },
  { latex: '\\frac{\\partial V}{\\partial t} + \\frac{1}{2}\\sigma^2 S^2 \\frac{\\partial^2 V}{\\partial S^2} = 0', complexity: 'complex' }
];

const OUTPUT_DIR = path.join(__dirname, '../public/equations');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Clean existing test files
for (let i = 0; i < 5; i++) {
  const filename = path.join(OUTPUT_DIR, `eq_${i}.png`);
  if (fs.existsSync(filename)) {
    fs.unlinkSync(filename);
  }
}

function renderEquation(equation, index) {
  console.log(`\nRendering equation ${index}: ${equation.latex}`);
  
  // Font sizes based on complexity
  const fontSize = equation.complexity === 'simple' ? 32 : 
                  equation.complexity === 'medium' ? 28 : 
                  24;
  
  // Create a temporary canvas to measure text
  const tempCanvas = createCanvas(1, 1);
  const tempCtx = tempCanvas.getContext('2d');
  tempCtx.font = `bold ${fontSize}px Arial`;
  
  // Process LaTeX to readable text (basic conversion)
  let displayText = equation.latex
    .replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '($1/$2)')
    .replace(/\\partial/g, '∂')
    .replace(/\\psi/g, 'ψ')
    .replace(/\\hbar/g, 'ℏ')
    .replace(/\\hat\{H\}/g, 'Ĥ')
    .replace(/\\nabla/g, '∇')
    .replace(/\\cdot/g, '·')
    .replace(/\\rho/g, 'ρ')
    .replace(/\\epsilon/g, 'ε')
    .replace(/\\sigma/g, 'σ')
    .replace(/\{/g, '')
    .replace(/\}/g, '')
    .replace(/\^2/g, '²')
    .replace(/\_0/g, '₀')
    .replace(/\_t/g, 'ₜ')
    .replace(/\\/g, '');
  
  // Measure the actual text
  const metrics = tempCtx.measureText(displayText);
  const textWidth = Math.ceil(metrics.width);
  const textHeight = fontSize * 1.5; // Approximate height
  
  // Add minimal padding
  const padding = 10;
  const canvasWidth = textWidth + padding * 2;
  const canvasHeight = textHeight + padding * 2;
  
  console.log(`  Text: "${displayText}"`);
  console.log(`  Font size: ${fontSize}px`);
  console.log(`  Text dimensions: ${textWidth}x${textHeight}`);
  console.log(`  Canvas size: ${canvasWidth}x${canvasHeight}`);
  
  // Create the actual canvas
  const canvas = createCanvas(canvasWidth, canvasHeight);
  const ctx = canvas.getContext('2d');
  
  // IMPORTANT: Set composite operation to ensure proper transparency
  ctx.globalCompositeOperation = 'source-over';
  
  // Clear canvas (transparent background)
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  
  // Reset all properties to ensure green color
  ctx.save();
  
  // Set font
  ctx.font = `bold ${fontSize}px Arial`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  // FORCE green color and full opacity
  ctx.globalAlpha = 1.0;
  ctx.fillStyle = '#22c55e';
  
  // Add glow effect
  ctx.shadowColor = '#22c55e';
  ctx.shadowBlur = 4;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;
  
  // Draw the text
  const x = canvasWidth / 2;
  const y = canvasHeight / 2;
  
  // Draw multiple times to ensure it's visible
  ctx.fillText(displayText, x, y);
  ctx.fillText(displayText, x, y); // Draw twice for stronger color
  
  // Restore context
  ctx.restore();
  
  // Verify color was applied
  const imageData = ctx.getImageData(canvasWidth/2, canvasHeight/2, 1, 1);
  const [r, g, b, a] = imageData.data;
  console.log(`  Center pixel color: rgba(${r}, ${g}, ${b}, ${a})`);
  
  // Save PNG
  const filename = `eq_${index}.png`;
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(path.join(OUTPUT_DIR, filename), buffer);
  
  console.log(`  ✓ Saved as ${filename}`);
  
  return {
    filename,
    width: canvasWidth,
    height: canvasHeight,
    latex: equation.latex,
    displayText,
    complexity: equation.complexity
  };
}

// Generate test batch
console.log('=== GENERATING FIXED TEST BATCH ===');
console.log('Target: Green text (#22c55e) on transparent background');
console.log('Minimal canvas size, bold font\n');

const results = [];
testEquations.forEach((eq, i) => {
  const result = renderEquation(eq, i);
  results.push(result);
});

// Save manifest
const manifest = {
  equations: results,
  metadata: {
    generatedAt: new Date().toISOString(),
    totalEquations: results.length,
    renderSettings: {
      color: '#22c55e',
      fontFamily: 'Arial',
      fontWeight: 'bold',
      glowRadius: 4,
      padding: 10
    }
  }
};

fs.writeFileSync(
  path.join(OUTPUT_DIR, 'test-manifest-fixed.json'),
  JSON.stringify(manifest, null, 2)
);

console.log('\n=== TEST BATCH COMPLETE ===');
console.log(`Generated ${results.length} equations`);
console.log('\nPlease check:');
console.log('1. Green text is visible');
console.log('2. Canvas size is appropriate (no wasted space)');
console.log('3. Text is fully opaque');
console.log('4. Glow effect is visible');