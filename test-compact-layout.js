/**
 * Test compact layout to verify gameplay fits in viewport
 */

const puppeteer = require('puppeteer');
const path = require('path');

const LOCAL_FILE = `file://${path.resolve(__dirname, 'index.html')}`;

async function testCompactLayout() {
  console.log('Testing compact layout...\n');

  const browser = await puppeteer.launch({
    headless: false,
  });

  // iPhone 16 viewport (393x852)
  const mobilePage = await browser.newPage();
  await mobilePage.setViewport({
    width: 393,
    height: 852,
    deviceScaleFactor: 2,
    isMobile: true,
  });

  console.log('📱 iPhone 16 (393x852):');
  await mobilePage.goto(LOCAL_FILE, { waitUntil: 'networkidle2' });

  // Get heights before playing
  const headerHeight = await mobilePage.$eval('.container', el => {
    const rect = el.getBoundingClientRect();
    return rect.height;
  });

  console.log(`   Container height: ${Math.round(headerHeight)}px`);

  // Take screenshot before
  await mobilePage.screenshot({ path: './compact-mobile-before.png', fullPage: false });
  console.log('   ✅ Screenshot: compact-mobile-before.png');

  // Play game
  await mobilePage.click('.game-buttons button:first-child');
  await new Promise(resolve => setTimeout(resolve, 500));

  // Get result position
  const resultPosition = await mobilePage.evaluate(() => {
    const resultBox = document.querySelector('.result');
    const rect = resultBox.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    return {
      bottom: Math.round(rect.bottom),
      viewportHeight,
      isVisible: rect.bottom <= viewportHeight,
    };
  });

  console.log(`   Result box bottom: ${resultPosition.bottom}px`);
  console.log(`   Viewport height: ${resultPosition.viewportHeight}px`);
  console.log(`   Result visible? ${resultPosition.isVisible ? '✅ YES' : '❌ NO - SCROLLING NEEDED'}`);

  // Take screenshot after playing
  await mobilePage.screenshot({ path: './compact-mobile-after.png', fullPage: false });
  console.log('   ✅ Screenshot: compact-mobile-after.png\n');

  await mobilePage.close();

  // 13" MacBook Pro (1440x900)
  const desktopPage = await browser.newPage();
  await desktopPage.setViewport({
    width: 1440,
    height: 900,
    deviceScaleFactor: 2,
  });

  console.log('💻 13" MacBook Pro (1440x900):');
  await desktopPage.goto(LOCAL_FILE, { waitUntil: 'networkidle2' });

  // Take screenshot before
  await desktopPage.screenshot({ path: './compact-desktop-before.png', fullPage: false });
  console.log('   ✅ Screenshot: compact-desktop-before.png');

  // Play game
  await desktopPage.click('.game-buttons button:first-child');
  await new Promise(resolve => setTimeout(resolve, 500));

  // Get result position
  const desktopResultPosition = await desktopPage.evaluate(() => {
    const resultBox = document.querySelector('.result');
    const rect = resultBox.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    return {
      bottom: Math.round(rect.bottom),
      viewportHeight,
      isVisible: rect.bottom <= viewportHeight,
    };
  });

  console.log(`   Result box bottom: ${desktopResultPosition.bottom}px`);
  console.log(`   Viewport height: ${desktopResultPosition.viewportHeight}px`);
  console.log(`   Result visible? ${desktopResultPosition.isVisible ? '✅ YES' : '❌ NO - SCROLLING NEEDED'}`);

  // Take screenshot after playing
  await desktopPage.screenshot({ path: './compact-desktop-after.png', fullPage: false });
  console.log('   ✅ Screenshot: compact-desktop-after.png\n');

  await desktopPage.close();

  console.log('========================================');
  if (resultPosition.isVisible && desktopResultPosition.isVisible) {
    console.log('✅ SUCCESS: Gameplay fits in viewport on both devices!');
  } else {
    console.log('⚠️  WARNING: Some elements still need scrolling');
  }
  console.log('========================================\n');

  await browser.close();
}

testCompactLayout();
