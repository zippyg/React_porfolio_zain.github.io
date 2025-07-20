const mathjax = require('mathjax');
const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

async function debugMathJax() {
  console.log('=== DEBUGGING MATHJAX RENDERING ===\n');
  
  // Initialize MathJax
  const MathJax = await mathjax.init({
    loader: { load: ['input/tex', 'output/svg'] },
    tex: {
      packages: ['base', 'ams', 'color']
    }
  });
  
  // Test equation
  const latex = 'E = mc^2';
  
  console.log('1. Testing basic LaTeX rendering...');
  const svg1 = MathJax.tex2svg(latex);
  const svgString1 = MathJax.startup.adaptor.outerHTML(svg1);
  console.log('Basic SVG (first 200 chars):', svgString1.substring(0, 200));
  
  console.log('\n2. Testing with color command...');
  const coloredLatex = `\\color{#22c55e}{${latex}}`;
  const svg2 = MathJax.tex2svg(coloredLatex);
  const svgString2 = MathJax.startup.adaptor.outerHTML(svg2);
  console.log('Colored SVG (first 200 chars):', svgString2.substring(0, 200));
  
  console.log('\n3. Extracting just the SVG element...');
  const svgMatch = svgString2.match(/<svg[^>]*>([\s\S]*?)<\/svg>/);
  if (svgMatch) {
    const cleanSvg = svgMatch[0];
    console.log('Clean SVG (first 300 chars):', cleanSvg.substring(0, 300));
    
    // Save the raw SVG to check
    await fs.writeFile('public/equations/debug_raw.svg', cleanSvg);
    console.log('\n4. Saved raw SVG as debug_raw.svg');
    
    // Check if color is in the SVG
    const hasGreenColor = cleanSvg.includes('#22c55e') || cleanSvg.includes('34,197,94');
    console.log('Contains green color?', hasGreenColor);
    
    // Look for fill attributes
    const fillMatches = cleanSvg.match(/fill="[^"]+"/g);
    console.log('Fill attributes found:', fillMatches);
    
    console.log('\n5. Converting SVG to PNG...');
    
    // Method 1: Direct conversion
    try {
      const buffer1 = await sharp(Buffer.from(cleanSvg))
        .png()
        .toBuffer();
      await fs.writeFile('public/equations/debug_direct.png', buffer1);
      console.log('✓ Created debug_direct.png');
    } catch (error) {
      console.error('Error with direct conversion:', error.message);
    }
    
    // Method 2: With explicit background
    try {
      const buffer2 = await sharp(Buffer.from(cleanSvg))
        .flatten({ background: { r: 255, g: 255, b: 255, alpha: 1 } })
        .png()
        .toBuffer();
      await fs.writeFile('public/equations/debug_white_bg.png', buffer2);
      console.log('✓ Created debug_white_bg.png (white background)');
    } catch (error) {
      console.error('Error with white background:', error.message);
    }
    
    // Method 3: Modify SVG to ensure color
    console.log('\n6. Trying to force green color in SVG...');
    let modifiedSvg = cleanSvg;
    
    // Replace any currentColor with green
    modifiedSvg = modifiedSvg.replace(/currentColor/g, '#22c55e');
    
    // Replace black fills with green
    modifiedSvg = modifiedSvg.replace(/fill="black"/g, 'fill="#22c55e"');
    modifiedSvg = modifiedSvg.replace(/fill="#000000"/g, 'fill="#22c55e"');
    modifiedSvg = modifiedSvg.replace(/fill="#000"/g, 'fill="#22c55e"');
    
    // If no fill attribute, add it to path elements
    modifiedSvg = modifiedSvg.replace(/<path([^>]+)>/g, (match, attrs) => {
      if (!attrs.includes('fill=')) {
        return `<path${attrs} fill="#22c55e">`;
      }
      return match;
    });
    
    await fs.writeFile('public/equations/debug_modified.svg', modifiedSvg);
    console.log('✓ Saved modified SVG as debug_modified.svg');
    
    try {
      const buffer3 = await sharp(Buffer.from(modifiedSvg))
        .png()
        .toBuffer();
      await fs.writeFile('public/equations/debug_forced_green.png', buffer3);
      console.log('✓ Created debug_forced_green.png');
    } catch (error) {
      console.error('Error with forced green:', error.message);
    }
  }
  
  console.log('\n=== PLEASE CHECK THESE FILES ===');
  console.log('1. debug_raw.svg - Original MathJax output');
  console.log('2. debug_direct.png - Direct SVG to PNG conversion');
  console.log('3. debug_white_bg.png - With white background');
  console.log('4. debug_modified.svg - Modified SVG with forced green');
  console.log('5. debug_forced_green.png - PNG from modified SVG');
}

debugMathJax().catch(console.error);