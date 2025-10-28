/**
 * Test PWA functionality for Vera's Rock Paper Scissors Battle
 */

const puppeteer = require('puppeteer');

const GAME_URL = 'https://d2m7mlcoklgntq.cloudfront.net';

async function testPWA() {
  console.log('========== Testing PWA Functionality ==========\n');

  const browser = await puppeteer.launch({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    const page = await browser.newPage();

    // Test 1: HTTPS loads successfully
    console.log(`1. Testing HTTPS site loads: ${GAME_URL}`);
    const response = await page.goto(GAME_URL, { waitUntil: 'networkidle2' });
    if (response.status() === 200) {
      console.log('✅ Site loads over HTTPS (200 OK)\n');
    } else {
      throw new Error(`Site returned status ${response.status()}`);
    }

    // Test 2: Manifest.json is accessible
    console.log('2. Testing manifest.json accessibility...');
    const manifestResponse = await page.goto(`${GAME_URL}/manifest.json`, { waitUntil: 'networkidle2' });
    if (manifestResponse.status() === 200) {
      const manifestContent = await manifestResponse.json();
      console.log('✅ Manifest.json accessible');
      console.log(`   Name: ${manifestContent.name}`);
      console.log(`   Short name: ${manifestContent.short_name}`);
      console.log(`   Icons: ${manifestContent.icons.length}`);
      console.log(`   Display: ${manifestContent.display}\n`);
    } else {
      throw new Error(`Manifest returned status ${manifestResponse.status()}`);
    }

    // Test 3: Service Worker registration
    console.log('3. Testing Service Worker registration...');
    await page.goto(GAME_URL, { waitUntil: 'networkidle2' });

    // Wait a bit for service worker to register
    await new Promise(resolve => setTimeout(resolve, 2000));

    const swRegistered = await page.evaluate(() => {
      return navigator.serviceWorker.getRegistration()
        .then(registration => {
          if (registration) {
            return {
              registered: true,
              scope: registration.scope,
              active: registration.active !== null
            };
          }
          return { registered: false };
        });
    });

    if (swRegistered.registered) {
      console.log('✅ Service Worker registered successfully');
      console.log(`   Scope: ${swRegistered.scope}`);
      console.log(`   Active: ${swRegistered.active}\n`);
    } else {
      throw new Error('Service Worker not registered');
    }

    // Test 4: PWA icons are accessible
    console.log('4. Testing PWA icons accessibility...');
    const icons = [
      { name: 'icon-192x192.png', url: `${GAME_URL}/icon-192x192.png` },
      { name: 'icon-512x512.png', url: `${GAME_URL}/icon-512x512.png` },
      { name: 'apple-touch-icon.png', url: `${GAME_URL}/apple-touch-icon.png` }
    ];

    for (const icon of icons) {
      const iconResponse = await page.goto(icon.url, { waitUntil: 'networkidle2' });
      if (iconResponse.status() === 200 && iconResponse.headers()['content-type'].includes('image')) {
        console.log(`✅ ${icon.name} accessible`);
      } else {
        throw new Error(`${icon.name} not accessible or wrong content type`);
      }
    }
    console.log();

    // Test 5: PWA meta tags present
    console.log('5. Testing PWA meta tags...');
    await page.goto(GAME_URL, { waitUntil: 'networkidle2' });

    const metaTags = await page.evaluate(() => {
      return {
        manifest: document.querySelector('link[rel="manifest"]') !== null,
        themeColor: document.querySelector('meta[name="theme-color"]') !== null,
        appleMobileCapable: document.querySelector('meta[name="apple-mobile-web-app-capable"]') !== null,
        appleStatusBar: document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]') !== null,
        appleTouchIcon: document.querySelector('link[rel="apple-touch-icon"]') !== null
      };
    });

    if (metaTags.manifest && metaTags.themeColor && metaTags.appleMobileCapable) {
      console.log('✅ PWA meta tags present:');
      console.log(`   Manifest link: ${metaTags.manifest}`);
      console.log(`   Theme color: ${metaTags.themeColor}`);
      console.log(`   Apple mobile capable: ${metaTags.appleMobileCapable}`);
      console.log(`   Apple status bar style: ${metaTags.appleStatusBar}`);
      console.log(`   Apple touch icon: ${metaTags.appleTouchIcon}\n`);
    } else {
      throw new Error('Some PWA meta tags missing');
    }

    // Test 6: Game still works
    console.log('6. Testing game functionality...');
    await page.goto(GAME_URL, { waitUntil: 'networkidle2' });
    await page.click('.game-buttons button:first-child');
    await new Promise(resolve => setTimeout(resolve, 500));

    const playerChoice = await page.$eval('#playerChoice', el => el.textContent);
    const computerChoice = await page.$eval('#computerChoice', el => el.textContent);
    const resultTitle = await page.$eval('.result h2', el => el.textContent);

    if (playerChoice !== '❓' && computerChoice !== '❓' && resultTitle !== 'READY TO BATTLE') {
      console.log('✅ Game functionality works:');
      console.log(`   Player chose: ${playerChoice}`);
      console.log(`   Computer chose: ${computerChoice}`);
      console.log(`   Result: ${resultTitle}\n`);
    } else {
      throw new Error('Game not functioning properly');
    }

    console.log('========================================');
    console.log('✅ ALL PWA TESTS PASSED!');
    console.log('The game is now a fully functional Progressive Web App.');
    console.log('========================================\n');

    console.log('📱 To install on mobile:');
    console.log('   - iOS: Tap Share → Add to Home Screen');
    console.log('   - Android: Tap menu → Install app');
    console.log('\n💻 To install on desktop:');
    console.log('   - Chrome/Edge: Click install icon in address bar');
    console.log('   - Or use browser menu → Install app\n');

  } catch (error) {
    console.error('\n========================================');
    console.error('❌ PWA TESTS FAILED');
    console.error(error);
    console.error('========================================\n');
    process.exit(1);
  } finally {
    await browser.close();
  }
}

// Run tests
testPWA();
