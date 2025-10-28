/**
 * Generate PWA icons from favicon.svg
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const ICON_SIZES = [
  { name: 'icon-192x192.png', size: 192 },
  { name: 'icon-512x512.png', size: 512 },
  { name: 'apple-touch-icon.png', size: 180 },
];

async function generateIcons() {
  console.log('Generating PWA icons from favicon.svg...\n');

  const svgPath = path.resolve(__dirname, 'favicon.svg');
  const svgContent = fs.readFileSync(svgPath, 'utf8');

  const browser = await puppeteer.launch({ headless: true });

  for (const icon of ICON_SIZES) {
    const page = await browser.newPage();

    // Set viewport to icon size
    await page.setViewport({
      width: icon.size,
      height: icon.size,
      deviceScaleFactor: 1,
    });

    // Create HTML with SVG scaled to viewport
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body {
            margin: 0;
            padding: 0;
            width: ${icon.size}px;
            height: ${icon.size}px;
            overflow: hidden;
          }
          svg {
            width: 100%;
            height: 100%;
          }
        </style>
      </head>
      <body>
        ${svgContent}
      </body>
      </html>
    `;

    await page.setContent(html);

    // Take screenshot
    const outputPath = path.resolve(__dirname, icon.name);
    await page.screenshot({
      path: outputPath,
      omitBackground: false,
    });

    console.log(`✅ Generated: ${icon.name} (${icon.size}x${icon.size})`);

    await page.close();
  }

  await browser.close();
  console.log('\n🎉 All icons generated successfully!');
}

generateIcons().catch(console.error);
