const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = path.join(__dirname, '../public/equations');

// Test direct pixel manipulation
function testPixelManipulation() {
  const canvas = createCanvas(200, 100);
  const ctx = canvas.getContext('2d');
  
  // Get image data
  const imageData = ctx.createImageData(200, 100);
  const data = imageData.data;
  
  // Fill with green pixels in a 50x50 square
  for (let y = 25; y < 75; y++) {
    for (let x = 75; x < 125; x++) {
      const idx = (y * 200 + x) * 4;
      data[idx] = 34;     // R
      data[idx + 1] = 197; // G  
      data[idx + 2] = 94;  // B
      data[idx + 3] = 255; // A (fully opaque)
    }
  }
  
  // Put the image data back
  ctx.putImageData(imageData, 0, 0);
  
  // Save
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(path.join(OUTPUT_DIR, 'pixel_test.png'), buffer);
  console.log('Created pixel_test.png - should show green square');
}

// Try different context settings
function testContextSettings() {
  const canvas = createCanvas(300, 100);
  const ctx = canvas.getContext('2d', { 
    pixelFormat: 'RGBA32',
    alpha: true 
  });
  
  // Try painting operations in specific order
  ctx.save();
  
  // Set all properties before any drawing
  ctx.globalAlpha = 1.0;
  ctx.globalCompositeOperation = 'source-over';
  
  // Draw background rect
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, 300, 100);
  
  // Now try text
  ctx.font = '40px Arial';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  
  // Try different color formats
  ctx.fillStyle = '#FFFFFF';
  ctx.fillText('White', 10, 10);
  
  ctx.fillStyle = 'rgb(34, 197, 94)';
  ctx.fillText('Green', 10, 50);
  
  ctx.restore();
  
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(path.join(OUTPUT_DIR, 'context_test.png'), buffer);
  console.log('Created context_test.png - testing different color formats');
}

// Test using Path2D for text outline
function testTextOutline() {
  const canvas = createCanvas(200, 100);
  const ctx = canvas.getContext('2d');
  
  // Clear to transparent
  ctx.clearRect(0, 0, 200, 100);
  
  // Set up text properties
  ctx.font = 'bold 40px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  const text = 'F = ma';
  const x = 100;
  const y = 50;
  
  // Try multiple approaches
  
  // 1. Fill with fully opaque green
  ctx.globalAlpha = 1.0;
  ctx.fillStyle = 'rgba(34, 197, 94, 1.0)';
  ctx.fillText(text, x, y);
  
  // 2. Add stroke on top
  ctx.strokeStyle = 'rgba(34, 197, 94, 1.0)';
  ctx.lineWidth = 2;
  ctx.strokeText(text, x, y);
  
  // 3. Try to sample what color we actually drew
  const imageData = ctx.getImageData(x, y, 1, 1);
  console.log(`Pixel at text center: rgba(${imageData.data[0]}, ${imageData.data[1]}, ${imageData.data[2]}, ${imageData.data[3]})`);
  
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(path.join(OUTPUT_DIR, 'outline_test.png'), buffer);
  console.log('Created outline_test.png - text with fill and stroke');
}

// Test with pre-filled background
function testPrefilledGreen() {
  const canvas = createCanvas(200, 100);
  const ctx = canvas.getContext('2d');
  
  // Fill entire canvas with green first
  ctx.fillStyle = '#22c55e';
  ctx.fillRect(0, 0, 200, 100);
  
  // Now try to draw black text on top
  ctx.fillStyle = '#000000';
  ctx.font = 'bold 40px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('F = ma', 100, 50);
  
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(path.join(OUTPUT_DIR, 'prefilled_test.png'), buffer);
  console.log('Created prefilled_test.png - black text on green background');
}

console.log('Running advanced debug tests...\n');

testPixelManipulation();
testContextSettings();
testTextOutline();
testPrefilledGreen();

console.log('\nPlease check these files:');
console.log('1. pixel_test.png - Direct pixel manipulation (green square)');
console.log('2. context_test.png - Different color format tests');
console.log('3. outline_test.png - Text with fill and stroke');
console.log('4. prefilled_test.png - Black text on green background');
console.log('\nIf pixel_test shows a green square, we know the canvas can output color.');
console.log('This will help us determine if the issue is with text rendering specifically.');