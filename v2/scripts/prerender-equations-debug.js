const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = path.join(__dirname, '../public/equations');

// Simple test - just render "F = ma" with explicit green
function renderSimpleTest() {
  const canvas = createCanvas(200, 100);
  const ctx = canvas.getContext('2d');
  
  // Fill with white background first to debug
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, 200, 100);
  
  // Draw green text
  ctx.font = 'bold 40px Arial';
  ctx.fillStyle = '#22c55e';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  // Draw text
  ctx.fillText('F = ma', 100, 50);
  
  // Save
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(path.join(OUTPUT_DIR, 'debug_white_bg.png'), buffer);
  
  console.log('Created debug_white_bg.png - should show green text on white background');
}

// Test with transparent background
function renderTransparentTest() {
  const canvas = createCanvas(200, 100);
  const ctx = canvas.getContext('2d');
  
  // Clear for transparency
  ctx.clearRect(0, 0, 200, 100);
  
  // Set up for green text
  ctx.font = 'bold 40px Arial';
  ctx.fillStyle = 'rgb(34, 197, 94)'; // Try RGB instead of hex
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  // Add stroke for visibility
  ctx.strokeStyle = 'rgb(34, 197, 94)';
  ctx.lineWidth = 2;
  
  // Draw text with both fill and stroke
  const text = 'F = ma';
  ctx.fillText(text, 100, 50);
  ctx.strokeText(text, 100, 50);
  
  // Save
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(path.join(OUTPUT_DIR, 'debug_transparent.png'), buffer);
  
  console.log('Created debug_transparent.png - should show green text on transparent background');
}

// Test with black background to ensure green is visible
function renderBlackBgTest() {
  const canvas = createCanvas(200, 100);
  const ctx = canvas.getContext('2d');
  
  // Black background
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, 200, 100);
  
  // Green text
  ctx.font = 'bold 40px Arial';
  ctx.fillStyle = '#22c55e';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  // Add glow
  ctx.shadowColor = '#22c55e';
  ctx.shadowBlur = 10;
  
  // Draw text
  ctx.fillText('F = ma', 100, 50);
  
  // Save
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(path.join(OUTPUT_DIR, 'debug_black_bg.png'), buffer);
  
  console.log('Created debug_black_bg.png - should show green text on black background');
}

console.log('Running debug tests...\n');
renderSimpleTest();
renderTransparentTest();
renderBlackBgTest();

console.log('\nPlease check these three files:');
console.log('1. debug_white_bg.png - Green text on white');
console.log('2. debug_transparent.png - Green text on transparent (with stroke)');
console.log('3. debug_black_bg.png - Green text on black with glow');