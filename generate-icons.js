/**
 * Generate brutalist PWA icons with RPS emojis
 */

const puppeteer = require('puppeteer');
const path = require('path');

const ICON_SIZES = [
  { name: 'icon-192x192.png', size: 192 },
  { name: 'icon-512x512.png', size: 512 },
  { name: 'apple-touch-icon.png', size: 180 },
];

async function generateIcons() {
  console.log('Generating brutalist RPS icons with emojis...\n');

  const browser = await puppeteer.launch({ headless: true });

  for (const icon of ICON_SIZES) {
    const page = await browser.newPage();

    // Set viewport to icon size
    await page.setViewport({
      width: icon.size,
      height: icon.size,
      deviceScaleFactor: 1,
    });

    // Calculate sizes
    const borderWidth = Math.floor(icon.size * 0.08);
    const fontSize = Math.floor(icon.size * 0.22);
    const vFontSize = Math.floor(icon.size * 0.18);
    const spacing = icon.size / 3.5;

    // Create HTML with brutalist design and RPS emojis
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
            background: #000000;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .container {
            width: ${icon.size - borderWidth * 2}px;
            height: ${icon.size - borderWidth * 2}px;
            background: #FFFFFF;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            position: relative;
          }
          .v-letter {
            position: absolute;
            top: ${icon.size * 0.15}px;
            font-family: 'Courier New', monospace;
            font-weight: bold;
            font-size: ${vFontSize}px;
            color: #000000;
          }
          .emojis {
            display: flex;
            gap: ${spacing * 0.3}px;
            font-size: ${fontSize}px;
            margin-top: ${icon.size * 0.08}px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="v-letter">V</div>
          <div class="emojis">
            <span>✊</span>
            <span>✋</span>
            <span>✌️</span>
          </div>
        </div>
      </body>
      </html>
    `;

    await page.setContent(html);
    await new Promise(resolve => setTimeout(resolve, 100));

    // Take screenshot
    const outputPath = path.resolve(__dirname, icon.name);
    await page.screenshot({
      path: outputPath,
      omitBackground: false,
    });

    console.log(`✅ Generated: ${icon.name} (${icon.size}x${icon.size}) with RPS emojis`);

    await page.close();
  }

  await browser.close();
  console.log('\n🎉 All brutalist icons generated successfully!');
  console.log('Icons feature:');
  console.log('- Black border (brutalist style)');
  console.log('- White background');
  console.log('- Rock (✊), Paper (✋), Scissors (✌️) emojis');
  console.log('- "V" for Vera at the top\n');
}

generateIcons().catch(console.error);
