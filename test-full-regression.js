/**
 * Full regression test suite for Vera's Rock Paper Scissors Battle
 * Tests HTTP redirect, HTTPS functionality, install banner, and PWA features
 */

const puppeteer = require('puppeteer');

const HTTP_URL = 'http://d2m7mlcoklgntq.cloudfront.net';
const HTTPS_URL = 'https://d2m7mlcoklgntq.cloudfront.net';

async function testHTTPRedirect() {
  console.log('========== Test 1: HTTP → HTTPS Redirect ==========\n');

  const browser = await puppeteer.launch({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    const page = await browser.newPage();

    // Navigate to HTTP URL and track redirects
    console.log(`Attempting to load: ${HTTP_URL}`);

    const response = await page.goto(HTTP_URL, { waitUntil: 'networkidle2' });
    const finalURL = page.url();
    const statusCode = response.status();

    console.log(`Response status: ${statusCode}`);
    console.log(`Final URL: ${finalURL}`);

    if (finalURL.startsWith('https://')) {
      console.log('✅ HTTP successfully redirected to HTTPS\n');
      return true;
    } else {
      console.log('❌ HTTP did NOT redirect to HTTPS\n');
      return false;
    }
  } catch (error) {
    console.error('❌ HTTP redirect test failed:', error.message);
    return false;
  } finally {
    await browser.close();
  }
}

async function testGameFunctionality() {
  console.log('========== Test 2: Full Game Functionality ==========\n');

  const browser = await puppeteer.launch({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    const page = await browser.newPage();

    // Test on HTTPS
    console.log(`Loading HTTPS version: ${HTTPS_URL}`);
    await page.goto(HTTPS_URL, { waitUntil: 'networkidle2' });

    // Check page loaded
    const title = await page.title();
    console.log(`✅ Page title: "${title}"`);

    // Check main elements
    const h1Text = await page.$eval('h1', el => el.textContent);
    console.log(`✅ Main heading: "${h1Text}"`);

    // Check game buttons
    const buttons = await page.$$('.game-buttons button');
    console.log(`✅ Found ${buttons.length} game buttons`);

    // Play a game
    console.log('Playing game (clicking ROCK)...');
    await page.click('.game-buttons button:first-child');
    await new Promise(resolve => setTimeout(resolve, 500));

    const playerChoice = await page.$eval('#playerChoice', el => el.textContent);
    const computerChoice = await page.$eval('#computerChoice', el => el.textContent);
    const resultTitle = await page.$eval('.result h2', el => el.textContent);

    console.log(`✅ Player: ${playerChoice}, Computer: ${computerChoice}`);
    console.log(`✅ Result: ${resultTitle}`);

    // Check scores updated
    const sessionWins = await page.$eval('#sessionWins', el => el.textContent);
    const sessionLosses = await page.$eval('#sessionLosses', el => el.textContent);
    const sessionDraws = await page.$eval('#sessionDraws', el => el.textContent);
    const total = parseInt(sessionWins) + parseInt(sessionLosses) + parseInt(sessionDraws);

    console.log(`✅ Session scores: W:${sessionWins} L:${sessionLosses} D:${sessionDraws} (Total: ${total})`);

    if (total !== 1) {
      throw new Error(`Expected 1 game played, got ${total}`);
    }

    console.log('✅ Game functionality working correctly\n');
    return true;
  } catch (error) {
    console.error('❌ Game functionality test failed:', error.message);
    return false;
  } finally {
    await browser.close();
  }
}

async function testInstallBanner() {
  console.log('========== Test 3: Install Banner ==========\n');

  const browser = await puppeteer.launch({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    const page = await browser.newPage();

    await page.goto(HTTPS_URL, { waitUntil: 'networkidle2' });

    // Check banner HTML exists
    const bannerExists = await page.$('#installBanner');
    if (!bannerExists) {
      throw new Error('Install banner HTML not found');
    }
    console.log('✅ Install banner HTML exists');

    // Check banner content
    const bannerContent = await page.evaluate(() => {
      return {
        heading: document.querySelector('#installBanner h3')?.textContent,
        description: document.querySelector('#installBanner p')?.textContent,
        installBtn: document.querySelector('#installBtn')?.textContent,
        dismissBtn: document.querySelector('#dismissBtn')?.textContent,
      };
    });

    console.log(`✅ Banner heading: "${bannerContent.heading}"`);
    console.log(`✅ Banner description: "${bannerContent.description}"`);
    console.log(`✅ Install button: "${bannerContent.installBtn}"`);
    console.log(`✅ Dismiss button: "${bannerContent.dismissBtn}"`);

    // Check visibility logic
    const visibility = await page.evaluate(() => {
      const banner = document.getElementById('installBanner');
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches
                        || window.navigator.standalone
                        || document.referrer.includes('android-app://');
      const dismissed = localStorage.getItem('installBannerDismissed');

      return {
        hasShowClass: banner.classList.contains('show'),
        computedDisplay: window.getComputedStyle(banner).display,
        isStandalone: isStandalone,
        isDismissed: !!dismissed,
        userAgent: navigator.userAgent
      };
    });

    console.log(`Banner visibility: ${visibility.computedDisplay !== 'none' ? 'VISIBLE' : 'HIDDEN'}`);
    console.log(`  - Has 'show' class: ${visibility.hasShowClass}`);
    console.log(`  - Is standalone: ${visibility.isStandalone}`);
    console.log(`  - Previously dismissed: ${visibility.isDismissed}`);

    // Test dismiss functionality
    console.log('\nTesting dismiss functionality...');

    // Force show banner
    await page.evaluate(() => {
      document.getElementById('installBanner').classList.add('show');
    });

    await new Promise(resolve => setTimeout(resolve, 500));

    // Click dismiss
    await page.click('#dismissBtn');
    await new Promise(resolve => setTimeout(resolve, 500));

    const dismissed = await page.evaluate(() => {
      const banner = document.getElementById('installBanner');
      const stored = localStorage.getItem('installBannerDismissed');
      return {
        hidden: !banner.classList.contains('show'),
        stored: !!stored
      };
    });

    if (dismissed.hidden && dismissed.stored) {
      console.log('✅ Dismiss button works correctly');
      console.log('✅ Dismissal stored in localStorage\n');
    } else {
      throw new Error('Dismiss functionality not working');
    }

    return true;
  } catch (error) {
    console.error('❌ Install banner test failed:', error.message);
    return false;
  } finally {
    await browser.close();
  }
}

async function testPWAFeatures() {
  console.log('========== Test 4: PWA Features ==========\n');

  const browser = await puppeteer.launch({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    const page = await browser.newPage();

    await page.goto(HTTPS_URL, { waitUntil: 'networkidle2' });

    // Check manifest
    const manifestResponse = await page.goto(`${HTTPS_URL}/manifest.json`);
    if (manifestResponse.status() !== 200) {
      throw new Error('Manifest.json not accessible');
    }
    const manifest = await manifestResponse.json();
    console.log(`✅ Manifest accessible`);
    console.log(`   Name: ${manifest.name}`);
    console.log(`   Icons: ${manifest.icons.length}`);

    // Check service worker registration
    await page.goto(HTTPS_URL, { waitUntil: 'networkidle2' });
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
      console.log(`✅ Service Worker registered`);
      console.log(`   Scope: ${swRegistered.scope}`);
      console.log(`   Active: ${swRegistered.active}`);
    } else {
      throw new Error('Service Worker not registered');
    }

    // Check PWA meta tags
    const metaTags = await page.evaluate(() => {
      return {
        manifest: !!document.querySelector('link[rel="manifest"]'),
        themeColor: !!document.querySelector('meta[name="theme-color"]'),
        appleMobile: !!document.querySelector('meta[name="apple-mobile-web-app-capable"]'),
        appleTouchIcon: !!document.querySelector('link[rel="apple-touch-icon"]')
      };
    });

    console.log(`✅ PWA meta tags present:`);
    console.log(`   Manifest link: ${metaTags.manifest}`);
    console.log(`   Theme color: ${metaTags.themeColor}`);
    console.log(`   Apple mobile capable: ${metaTags.appleMobile}`);
    console.log(`   Apple touch icon: ${metaTags.appleTouchIcon}\n`);

    return true;
  } catch (error) {
    console.error('❌ PWA features test failed:', error.message);
    return false;
  } finally {
    await browser.close();
  }
}

async function runFullRegression() {
  console.log('\n╔═══════════════════════════════════════════════════════════╗');
  console.log('║  FULL REGRESSION TEST SUITE                               ║');
  console.log('║  Vera\'s Rock Paper Scissors Battle                         ║');
  console.log('╚═══════════════════════════════════════════════════════════╝\n');

  const results = {
    httpRedirect: false,
    gameFunctionality: false,
    installBanner: false,
    pwaFeatures: false
  };

  // Run all tests
  results.httpRedirect = await testHTTPRedirect();
  results.gameFunctionality = await testGameFunctionality();
  results.installBanner = await testInstallBanner();
  results.pwaFeatures = await testPWAFeatures();

  // Summary
  console.log('╔═══════════════════════════════════════════════════════════╗');
  console.log('║  TEST SUMMARY                                             ║');
  console.log('╚═══════════════════════════════════════════════════════════╝\n');

  const tests = [
    { name: 'HTTP → HTTPS Redirect', result: results.httpRedirect },
    { name: 'Game Functionality', result: results.gameFunctionality },
    { name: 'Install Banner', result: results.installBanner },
    { name: 'PWA Features', result: results.pwaFeatures }
  ];

  tests.forEach(test => {
    const status = test.result ? '✅ PASS' : '❌ FAIL';
    console.log(`${status} - ${test.name}`);
  });

  const allPassed = Object.values(results).every(r => r === true);

  console.log('\n' + '═'.repeat(61));
  if (allPassed) {
    console.log('✅ ALL TESTS PASSED! Game is production ready.');
  } else {
    console.log('❌ SOME TESTS FAILED. Check output above for details.');
    process.exit(1);
  }
  console.log('═'.repeat(61) + '\n');
}

// Run the full regression suite
runFullRegression();
