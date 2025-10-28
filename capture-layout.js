/**
 * Capture layout screenshots to analyze spacing issues
 */

const puppeteer = require('puppeteer');

const GAME_URL = 'http://veras-rps-battle-1761624731.s3-website-us-east-1.amazonaws.com';

async function captureLayout() {
  const browser = await puppeteer.launch({
    headless: false,
  });

  // Mobile viewport
  const mobilePage = await browser.newPage();
  await mobilePage.setViewport({
    width: 375,
    height: 812,
    deviceScaleFactor: 2,
    isMobile: true,
  });

  console.log('📱 Capturing mobile layout...');
  await mobilePage.goto(GAME_URL, { waitUntil: 'networkidle2' });

  // Initial state
  await mobilePage.screenshot({ path: './layout-mobile-before.png', fullPage: true });
  console.log('✅ Saved: layout-mobile-before.png');

  // After clicking
  await mobilePage.click('.game-buttons button:first-child');
  await new Promise(resolve => setTimeout(resolve, 500));
  await mobilePage.screenshot({ path: './layout-mobile-after.png', fullPage: true });
  console.log('✅ Saved: layout-mobile-after.png');

  // Viewport screenshot (what user sees without scrolling)
  await mobilePage.screenshot({ path: './layout-mobile-viewport.png', fullPage: false });
  console.log('✅ Saved: layout-mobile-viewport.png (viewport only)');

  await mobilePage.close();

  // Desktop viewport
  const desktopPage = await browser.newPage();
  await desktopPage.setViewport({
    width: 1920,
    height: 1080,
    deviceScaleFactor: 1,
  });

  console.log('💻 Capturing desktop layout...');
  await desktopPage.goto(GAME_URL, { waitUntil: 'networkidle2' });

  // Initial state
  await desktopPage.screenshot({ path: './layout-desktop-before.png', fullPage: true });
  console.log('✅ Saved: layout-desktop-before.png');

  // After clicking
  await desktopPage.click('.game-buttons button:first-child');
  await new Promise(resolve => setTimeout(resolve, 500));
  await desktopPage.screenshot({ path: './layout-desktop-after.png', fullPage: true });
  console.log('✅ Saved: layout-desktop-after.png');

  // Viewport screenshot
  await desktopPage.screenshot({ path: './layout-desktop-viewport.png', fullPage: false });
  console.log('✅ Saved: layout-desktop-viewport.png (viewport only)');

  await desktopPage.close();

  console.log('\n📸 All layout screenshots captured!');
  await browser.close();
}

captureLayout();
