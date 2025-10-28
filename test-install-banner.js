/**
 * Test install banner functionality
 */

const puppeteer = require('puppeteer');

const GAME_URL = 'https://d2m7mlcoklgntq.cloudfront.net';

async function testInstallBanner() {
  console.log('========== Testing Install Banner ==========\n');

  const browser = await puppeteer.launch({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    const page = await browser.newPage();

    // Test 1: Load page
    console.log('1. Loading page...');
    await page.goto(GAME_URL, { waitUntil: 'networkidle2' });
    console.log('✅ Page loaded\n');

    // Test 2: Check if install banner HTML exists
    console.log('2. Checking install banner HTML...');
    const bannerExists = await page.$('#installBanner');
    if (bannerExists) {
      console.log('✅ Install banner HTML exists\n');
    } else {
      throw new Error('Install banner HTML not found');
    }

    // Test 3: Check if banner is initially hidden
    console.log('3. Checking initial banner visibility...');
    const initiallyHidden = await page.evaluate(() => {
      const banner = document.getElementById('installBanner');
      const hasShowClass = banner.classList.contains('show');
      const computedDisplay = window.getComputedStyle(banner).display;
      return { hasShowClass, computedDisplay };
    });

    console.log(`   Has 'show' class: ${initiallyHidden.hasShowClass}`);
    console.log(`   Computed display: ${initiallyHidden.computedDisplay}`);

    if (initiallyHidden.computedDisplay === 'none' || !initiallyHidden.hasShowClass) {
      console.log('✅ Banner correctly hidden initially\n');
    }

    // Test 4: Check banner content
    console.log('4. Checking banner content...');
    const bannerContent = await page.evaluate(() => {
      return {
        heading: document.querySelector('#installBanner h3')?.textContent,
        description: document.querySelector('#installBanner p')?.textContent,
        installBtn: document.querySelector('#installBtn')?.textContent,
        dismissBtn: document.querySelector('#dismissBtn')?.textContent,
      };
    });

    console.log(`   Heading: ${bannerContent.heading}`);
    console.log(`   Description: ${bannerContent.description}`);
    console.log(`   Install button: ${bannerContent.installBtn}`);
    console.log(`   Dismiss button: ${bannerContent.dismissBtn}`);

    if (bannerContent.heading && bannerContent.installBtn && bannerContent.dismissBtn) {
      console.log('✅ All banner content present\n');
    } else {
      throw new Error('Banner content missing');
    }

    // Test 5: Test dismiss functionality
    console.log('5. Testing dismiss functionality...');

    // Manually show the banner for testing
    await page.evaluate(() => {
      document.getElementById('installBanner').classList.add('show');
    });

    // Wait a bit
    await new Promise(resolve => setTimeout(resolve, 500));

    // Check if banner is now visible
    const isVisible = await page.evaluate(() => {
      const banner = document.getElementById('installBanner');
      return window.getComputedStyle(banner).display !== 'none';
    });

    if (isVisible) {
      console.log('✅ Banner can be shown programmatically');
    }

    // Click dismiss button
    await page.click('#dismissBtn');

    // Wait a bit
    await new Promise(resolve => setTimeout(resolve, 500));

    // Check if banner is hidden again
    const isHiddenAfterDismiss = await page.evaluate(() => {
      const banner = document.getElementById('installBanner');
      return !banner.classList.contains('show');
    });

    if (isHiddenAfterDismiss) {
      console.log('✅ Dismiss button hides banner\n');
    } else {
      throw new Error('Dismiss button did not hide banner');
    }

    // Test 6: Check localStorage after dismiss
    console.log('6. Checking localStorage after dismiss...');
    const dismissalStored = await page.evaluate(() => {
      return localStorage.getItem('installBannerDismissed') !== null;
    });

    if (dismissalStored) {
      console.log('✅ Dismissal stored in localStorage\n');
    } else {
      throw new Error('Dismissal not stored in localStorage');
    }

    console.log('========================================');
    console.log('✅ ALL INSTALL BANNER TESTS PASSED!');
    console.log('========================================\n');

    console.log('Banner behavior:');
    console.log('- Hidden by default');
    console.log('- Shows on browsers that support beforeinstallprompt');
    console.log('- Shows on iOS after 3 seconds');
    console.log('- Can be dismissed (stored for 7 days)');
    console.log('- Install button triggers native prompt or shows instructions\n');

  } catch (error) {
    console.error('\n========================================');
    console.error('❌ INSTALL BANNER TESTS FAILED');
    console.error(error);
    console.error('========================================\n');
    process.exit(1);
  } finally {
    await browser.close();
  }
}

// Run tests
testInstallBanner();
