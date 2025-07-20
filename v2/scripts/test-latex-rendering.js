const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const path = require('path');

// Test equations with various LaTeX features
const testEquations = [
  { latex: 'F = ma', name: 'simple' },
  { latex: '\\sum_{i=1}^{n} i = \\frac{n(n+1)}{2}', name: 'sum_with_limits' },
  { latex: '\\dot{x} = \\frac{dx}{dt}', name: 'dot_notation' },
  { latex: '\\int_{0}^{\\infty} e^{-x^2} dx = \\frac{\\sqrt{\\pi}}{2}', name: 'integral' },
  { latex: '\\nabla \\times \\vec{F} = 0', name: 'vector_calculus' },
  { latex: 'E = mc^2', name: 'superscript' },
  { latex: 'a_{n+1} = a_n + d', name: 'subscript' },
  { latex: '\\hat{H}\\psi = E\\psi', name: 'hat_notation' },
  { latex: '\\mathbb{E}[X] = \\mu', name: 'expectation' },
  { latex: '\\sigma = \\sqrt{\\frac{1}{N}\\sum_{i=1}^{N}(x_i - \\mu)^2}', name: 'complex_formula' }
];

async function testRender() {
  const browser = await puppeteer.launch({ headless: 'new' });
  const outputDir = path.join(__dirname, '../public/equations/test');
  
  await fs.mkdir(outputDir, { recursive: true });
  
  console.log('=== Testing LaTeX Rendering ===\n');
  
  for (const eq of testEquations) {
    const page = await browser.newPage();
    
    try {
      const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css">
          <script src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js"></script>
          <style>
            body {
              margin: 0;
              padding: 15px;
              background: transparent;
              display: inline-block;
            }
            #equation {
              color: #22c55e;
              font-size: 24px;
              display: inline-block;
            }
          </style>
        </head>
        <body>
          <div id="equation"></div>
          <script>
            const latex = ${JSON.stringify(eq.latex)};
            console.log('Rendering:', latex);
            try {
              katex.render(latex, document.getElementById("equation"), {
                displayMode: true,
                throwOnError: true
              });
              document.getElementById("equation").setAttribute("data-rendered", "true");
            } catch (e) {
              document.getElementById("equation").innerHTML = 'ERROR: ' + e.message;
              document.getElementById("equation").style.color = 'red';
              document.getElementById("equation").setAttribute("data-rendered", "error");
            }
          </script>
        </body>
        </html>
      `;
      
      await page.setContent(html, { waitUntil: 'networkidle0' });
      
      // Check for errors
      const hasError = await page.$('#equation[data-rendered="error"]');
      if (hasError) {
        const errorText = await page.$eval('#equation', el => el.textContent);
        console.log(`❌ ${eq.name}: ${errorText}`);
      } else {
        await page.waitForSelector('#equation[data-rendered="true"]', { timeout: 5000 });
        
        // Get bounding box
        const boundingBox = await page.evaluate(() => {
          const element = document.getElementById('equation');
          const rect = element.getBoundingClientRect();
          return {
            width: Math.ceil(rect.width),
            height: Math.ceil(rect.height)
          };
        });
        
        // Take screenshot
        await page.setViewport({
          width: boundingBox.width + 30,
          height: boundingBox.height + 30,
          deviceScaleFactor: 2
        });
        
        const buffer = await page.screenshot({
          omitBackground: true,
          type: 'png'
        });
        
        const filename = `test_${eq.name}.png`;
        await fs.writeFile(path.join(outputDir, filename), buffer);
        
        console.log(`✓ ${eq.name}: ${eq.latex}`);
        console.log(`  Saved as ${filename} (${boundingBox.width}x${boundingBox.height}px)\n`);
      }
      
    } catch (error) {
      console.log(`❌ ${eq.name}: ${error.message}\n`);
    } finally {
      await page.close();
    }
  }
  
  await browser.close();
  
  console.log('\n=== Test Complete ===');
  console.log('Check the files in /public/equations/test/');
  console.log('Each should show proper LaTeX rendering in green.');
}

testRender().catch(console.error);