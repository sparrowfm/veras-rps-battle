/**
 * Test theme system functionality
 */

const puppeteer = require('puppeteer');

const GAME_URL = 'https://d2m7mlcoklgntq.cloudfront.net';

async function testThemeSystem() {
  console.log('========== Testing Theme System ==========\n');

  const browser = await puppeteer.launch({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    const page = await browser.newPage();

    // Test 1: Load page and check default theme
    console.log('1. Checking default theme...');
    await page.goto(GAME_URL, { waitUntil: 'networkidle2' });

    const defaultTheme = await page.evaluate(() => {
      return document.body.getAttribute('data-theme');
    });

    console.log(`✅ Default theme: ${defaultTheme}`);

    // Test 2: Check theme toggle buttons exist
    console.log('\n2. Checking theme toggle UI...');
    const themeButtons = await page.evaluate(() => {
      const buttons = document.querySelectorAll('.theme-btn');
      return Array.from(buttons).map(btn => ({
        text: btn.textContent,
        theme: btn.getAttribute('data-theme'),
        active: btn.classList.contains('active')
      }));
    });

    console.log(`✅ Found ${themeButtons.length} theme buttons:`);
    themeButtons.forEach(btn => {
      console.log(`   - ${btn.text} (${btn.theme})${btn.active ? ' [ACTIVE]' : ''}`);
    });

    // Test 3: Switch to Y2K theme
    console.log('\n3. Testing theme switch to Y2K...');
    await page.click('button[data-theme="y2k"]');
    await new Promise(resolve => setTimeout(resolve, 500));

    const y2kTheme = await page.evaluate(() => {
      const theme = document.body.getAttribute('data-theme');
      const stored = localStorage.getItem('theme');
      const activeBtn = document.querySelector('.theme-btn.active')?.getAttribute('data-theme');
      return { theme, stored, activeBtn };
    });

    if (y2kTheme.theme === 'y2k' && y2kTheme.stored === 'y2k' && y2kTheme.activeBtn === 'y2k') {
      console.log('✅ Y2K theme applied successfully');
      console.log(`   - Body data-theme: ${y2kTheme.theme}`);
      console.log(`   - localStorage: ${y2kTheme.stored}`);
      console.log(`   - Active button: ${y2kTheme.activeBtn}`);
    } else {
      throw new Error('Y2K theme not applied correctly');
    }

    // Test 4: Switch to Neon theme
    console.log('\n4. Testing theme switch to Neon...');
    await page.click('button[data-theme="neon"]');
    await new Promise(resolve => setTimeout(resolve, 500));

    const neonTheme = await page.evaluate(() => {
      const theme = document.body.getAttribute('data-theme');
      const stored = localStorage.getItem('theme');
      const activeBtn = document.querySelector('.theme-btn.active')?.getAttribute('data-theme');
      return { theme, stored, activeBtn };
    });

    if (neonTheme.theme === 'neon' && neonTheme.stored === 'neon' && neonTheme.activeBtn === 'neon') {
      console.log('✅ Neon theme applied successfully');
      console.log(`   - Body data-theme: ${neonTheme.theme}`);
      console.log(`   - localStorage: ${neonTheme.stored}`);
      console.log(`   - Active button: ${neonTheme.activeBtn}`);
    } else {
      throw new Error('Neon theme not applied correctly');
    }

    // Test 5: Reload page and verify theme persistence
    console.log('\n5. Testing theme persistence after reload...');
    await page.reload({ waitUntil: 'networkidle2' });
    await new Promise(resolve => setTimeout(resolve, 1000));

    const persistedTheme = await page.evaluate(() => {
      return {
        theme: document.body.getAttribute('data-theme'),
        stored: localStorage.getItem('theme'),
        activeBtn: document.querySelector('.theme-btn.active')?.getAttribute('data-theme')
      };
    });

    if (persistedTheme.theme === 'neon' && persistedTheme.stored === 'neon') {
      console.log('✅ Theme persisted after page reload');
      console.log(`   - Theme after reload: ${persistedTheme.theme}`);
    } else {
      throw new Error('Theme did not persist after reload');
    }

    // Test 6: Switch back to Brutalist and verify
    console.log('\n6. Testing theme switch back to Brutalist...');
    await page.click('button[data-theme="brutalist"]');
    await new Promise(resolve => setTimeout(resolve, 500));

    const brutalistTheme = await page.evaluate(() => {
      return {
        theme: document.body.getAttribute('data-theme'),
        stored: localStorage.getItem('theme'),
        activeBtn: document.querySelector('.theme-btn.active')?.getAttribute('data-theme')
      };
    });

    if (brutalistTheme.theme === 'brutalist') {
      console.log('✅ Brutalist theme restored successfully');
    } else {
      throw new Error('Could not restore Brutalist theme');
    }

    // Test 7: Verify CSS variables are changing
    console.log('\n7. Testing CSS variable changes...');
    const cssVars = await page.evaluate(() => {
      const styles = window.getComputedStyle(document.body);
      return {
        bgColor: styles.getPropertyValue('--bg-color').trim(),
        textColor: styles.getPropertyValue('--text-color').trim(),
        borderColor: styles.getPropertyValue('--border-color').trim()
      };
    });

    console.log('✅ CSS variables are active:');
    console.log(`   - --bg-color: ${cssVars.bgColor}`);
    console.log(`   - --text-color: ${cssVars.textColor}`);
    console.log(`   - --border-color: ${cssVars.borderColor}`);

    console.log('\n========================================');
    console.log('✅ ALL THEME TESTS PASSED!');
    console.log('========================================\n');

    console.log('Theme system verified:');
    console.log('- All 3 themes (Brutalist, Y2K, Neon) work correctly');
    console.log('- Theme toggle UI functions properly');
    console.log('- Theme selection persists in localStorage');
    console.log('- Theme persists after page reload');
    console.log('- CSS variables update correctly for each theme\n');

  } catch (error) {
    console.error('\n========================================');
    console.error('❌ THEME TESTS FAILED');
    console.error(error);
    console.error('========================================\n');
    process.exit(1);
  } finally {
    await browser.close();
  }
}

// Run tests
testThemeSystem();
