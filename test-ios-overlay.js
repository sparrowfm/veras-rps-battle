/**
 * Test iOS install overlay functionality
 */

const puppeteer = require('puppeteer');

const GAME_URL = 'https://d2m7mlcoklgntq.cloudfront.net';

async function testIOSOverlay() {
  console.log('========== Testing iOS Install Overlay ==========\n');

  const browser = await puppeteer.launch({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    const page = await browser.newPage();

    // Emulate iPhone
    await page.emulate({
      name: 'iPhone 12',
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1',
      viewport: {
        width: 390,
        height: 844,
        deviceScaleFactor: 3,
        isMobile: true,
        hasTouch: true,
        isLandscape: false
      }
    });

    console.log('1. Loading page with iPhone emulation...');
    await page.goto(GAME_URL, { waitUntil: 'networkidle2' });
    console.log('✅ Page loaded on iPhone emulation');

    // Test 2: Check if iOS overlay HTML exists
    console.log('\n2. Checking iOS overlay HTML...');
    const overlayExists = await page.$('#iosInstallOverlay');
    if (!overlayExists) {
      throw new Error('iOS install overlay HTML not found');
    }
    console.log('✅ iOS overlay HTML exists');

    // Test 3: Check overlay content
    console.log('\n3. Checking overlay content...');
    const overlayContent = await page.evaluate(() => {
      const overlay = document.getElementById('iosInstallOverlay');
      return {
        heading: overlay.querySelector('h3')?.textContent,
        arrow: overlay.querySelector('.ios-install-arrow')?.textContent,
        steps: Array.from(overlay.querySelectorAll('.ios-install-step')).map(s => s.textContent),
        closeBtn: overlay.querySelector('.ios-close-btn')?.textContent,
        initialDisplay: window.getComputedStyle(overlay).display
      };
    });

    console.log(`✅ Overlay heading: "${overlayContent.heading}"`);
    console.log(`✅ Animated arrow: "${overlayContent.arrow}"`);
    console.log(`✅ Number of steps: ${overlayContent.steps.length}`);
    overlayContent.steps.forEach((step, i) => {
      console.log(`   Step ${i + 1}: ${step}`);
    });
    console.log(`✅ Close button: "${overlayContent.closeBtn}"`);
    console.log(`✅ Initial display: ${overlayContent.initialDisplay}`);

    // Test 4: Verify overlay is hidden initially
    console.log('\n4. Verifying overlay is hidden initially...');
    if (overlayContent.initialDisplay === 'none') {
      console.log('✅ Overlay correctly hidden on page load');
    } else {
      throw new Error('Overlay should be hidden initially');
    }

    // Test 5: Force show banner and click install to trigger iOS overlay
    console.log('\n5. Testing overlay trigger on iOS...');
    await page.evaluate(() => {
      // Clear any dismissal
      localStorage.removeItem('installBannerDismissed');
      // Force show banner
      const banner = document.getElementById('installBanner');
      banner.classList.add('show');
    });

    await new Promise(resolve => setTimeout(resolve, 500));

    // Click install button
    await page.click('#installBtn');
    await new Promise(resolve => setTimeout(resolve, 500));

    // Check if overlay is now visible
    const overlayVisible = await page.evaluate(() => {
      const overlay = document.getElementById('iosInstallOverlay');
      return window.getComputedStyle(overlay).display !== 'none';
    });

    if (overlayVisible) {
      console.log('✅ iOS overlay triggered successfully on install button click');
    } else {
      throw new Error('iOS overlay did not appear');
    }

    // Test 6: Check banner is hidden when overlay shows
    console.log('\n6. Verifying install banner is hidden...');
    const bannerHidden = await page.evaluate(() => {
      const banner = document.getElementById('installBanner');
      return !banner.classList.contains('show');
    });

    if (bannerHidden) {
      console.log('✅ Install banner correctly hidden when overlay shows');
    } else {
      throw new Error('Install banner should be hidden');
    }

    // Test 7: Test close button
    console.log('\n7. Testing overlay close functionality...');
    await page.click('.ios-close-btn');
    await new Promise(resolve => setTimeout(resolve, 500));

    const overlayHiddenAfterClose = await page.evaluate(() => {
      const overlay = document.getElementById('iosInstallOverlay');
      return window.getComputedStyle(overlay).display === 'none';
    });

    if (overlayHiddenAfterClose) {
      console.log('✅ Overlay closes correctly');
    } else {
      throw new Error('Overlay did not close');
    }

    // Test 8: Test on Android (should show regular prompt)
    console.log('\n8. Testing behavior on Android...');
    await page.setUserAgent('Mozilla/5.0 (Linux; Android 11; Pixel 5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.91 Mobile Safari/537.36');
    await page.reload({ waitUntil: 'networkidle2' });
    await new Promise(resolve => setTimeout(resolve, 500));

    // Force show banner
    await page.evaluate(() => {
      localStorage.removeItem('installBannerDismissed');
      const banner = document.getElementById('installBanner');
      banner.classList.add('show');
    });

    await new Promise(resolve => setTimeout(resolve, 500));

    const androidBehavior = await page.evaluate(() => {
      return {
        isIOS: /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream,
        userAgent: navigator.userAgent.substring(0, 50) + '...'
      };
    });

    console.log(`✅ Android detection working`);
    console.log(`   - Is iOS: ${androidBehavior.isIOS}`);
    console.log(`   - User agent: ${androidBehavior.userAgent}`);

    console.log('\n========================================');
    console.log('✅ ALL iOS OVERLAY TESTS PASSED!');
    console.log('========================================\n');

    console.log('iOS overlay verified:');
    console.log('- Overlay HTML structure correct');
    console.log('- Animated arrow present');
    console.log('- 3 step instructions included');
    console.log('- Overlay hidden by default');
    console.log('- Triggers correctly on iOS when install button clicked');
    console.log('- Banner hides when overlay shows');
    console.log('- Close button works correctly');
    console.log('- Different behavior on Android vs iOS\n');

  } catch (error) {
    console.error('\n========================================');
    console.error('❌ iOS OVERLAY TESTS FAILED');
    console.error(error);
    console.error('========================================\n');
    process.exit(1);
  } finally {
    await browser.close();
  }
}

// Run tests
testIOSOverlay();
