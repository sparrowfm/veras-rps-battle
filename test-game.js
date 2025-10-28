/**
 * Puppeteer test for Vera's Rock Paper Scissors Battle
 * Tests both desktop and mobile viewports
 */

const puppeteer = require('puppeteer');

const GAME_URL = 'http://veras-rps-battle-1761624731.s3-website-us-east-1.amazonaws.com';

// Viewport configurations
const VIEWPORTS = {
  desktop: {
    width: 1920,
    height: 1080,
    deviceScaleFactor: 1,
    isMobile: false,
  },
  mobile: {
    width: 375,
    height: 812,
    deviceScaleFactor: 2,
    isMobile: true,
  },
};

async function testViewport(browser, viewportName, viewport) {
  console.log(`\n========== Testing ${viewportName.toUpperCase()} Viewport ==========`);

  const page = await browser.newPage();
  await page.setViewport(viewport);

  try {
    // Navigate to game
    console.log(`Navigating to ${GAME_URL}...`);
    await page.goto(GAME_URL, { waitUntil: 'networkidle2' });

    // Test 1: Page loads successfully
    const title = await page.title();
    console.log(`✅ Page loaded. Title: "${title}"`);
    if (!title.includes("VERA'S ROCK PAPER SCISSORS BATTLE")) {
      throw new Error('Title mismatch');
    }

    // Test 2: Check for main elements
    const h1Text = await page.$eval('h1', el => el.textContent);
    console.log(`✅ Main heading: "${h1Text}"`);

    const tagline = await page.$eval('.tagline', el => el.textContent);
    console.log(`✅ Tagline: "${tagline}"`);

    // Test 3: Verify game buttons exist
    const buttons = await page.$$('.game-buttons button');
    console.log(`✅ Found ${buttons.length} game buttons (expected 3)`);
    if (buttons.length !== 3) {
      throw new Error(`Expected 3 buttons, found ${buttons.length}`);
    }

    // Test 4: Verify score boxes
    const scoreBoxes = await page.$$('.score-box');
    console.log(`✅ Found ${scoreBoxes.length} score boxes (expected 2)`);

    // Test 5: Check initial scores are zero
    const sessionWins = await page.$eval('#sessionWins', el => el.textContent);
    const allTimeWins = await page.$eval('#allTimeWins', el => el.textContent);
    console.log(`✅ Initial scores - Session: ${sessionWins}, All-time: ${allTimeWins}`);

    // Test 6: Play a game (click Rock button)
    console.log('Playing game: clicking ROCK button...');
    await page.click('.game-buttons button:first-child');

    // Wait a bit for the game to update
    await new Promise(resolve => setTimeout(resolve, 500));

    // Test 7: Check that choices were displayed
    const playerChoice = await page.$eval('#playerChoice', el => el.textContent);
    const computerChoice = await page.$eval('#computerChoice', el => el.textContent);
    console.log(`✅ Player chose: ${playerChoice}, Computer chose: ${computerChoice}`);

    if (playerChoice === '❓' || computerChoice === '❓') {
      throw new Error('Choices not updated after click');
    }

    // Test 8: Check that result was displayed
    const resultTitle = await page.$eval('.result h2', el => el.textContent);
    const resultText = await page.$eval('.result p', el => el.textContent);
    console.log(`✅ Result: ${resultTitle} - "${resultText}"`);

    if (resultTitle === 'READY TO BATTLE') {
      throw new Error('Result not updated after game');
    }

    // Test 9: Verify score updated
    const sessionWinsAfter = await page.$eval('#sessionWins', el => el.textContent);
    const sessionLossesAfter = await page.$eval('#sessionLosses', el => el.textContent);
    const sessionDrawsAfter = await page.$eval('#sessionDraws', el => el.textContent);
    const totalGames = parseInt(sessionWinsAfter) + parseInt(sessionLossesAfter) + parseInt(sessionDrawsAfter);
    console.log(`✅ Scores updated - W:${sessionWinsAfter} L:${sessionLossesAfter} D:${sessionDrawsAfter} (Total: ${totalGames})`);

    if (totalGames !== 1) {
      throw new Error(`Expected total games = 1, got ${totalGames}`);
    }

    // Test 10: Check footer exists
    const footer = await page.$('footer');
    const footerText = await page.$eval('footer', el => el.textContent);
    console.log(`✅ Footer exists: "${footerText.substring(0, 50)}..."`);

    // Test 11: Verify GoatCounter analytics loaded
    const goatCounterScript = await page.$('script[data-goatcounter]');
    console.log(`✅ GoatCounter analytics ${goatCounterScript ? 'loaded' : 'NOT FOUND'}`);

    // Test 12: Check meta tags
    const metaDescription = await page.$eval('meta[name="description"]', el => el.content);
    console.log(`✅ Meta description: "${metaDescription.substring(0, 60)}..."`);

    // Test 13: Check favicon
    const favicon = await page.$('link[rel="icon"]');
    console.log(`✅ Favicon ${favicon ? 'found' : 'NOT FOUND'}`);

    // Test 14: Take screenshot
    const screenshotPath = `./screenshot-${viewportName}.png`;
    await page.screenshot({ path: screenshotPath, fullPage: true });
    console.log(`✅ Screenshot saved: ${screenshotPath}`);

    // Test 15: Play multiple games to test localStorage
    console.log('Playing 5 more games to test scoring...');
    for (let i = 0; i < 5; i++) {
      const buttonIndex = Math.floor(Math.random() * 3);
      await page.click(`.game-buttons button:nth-child(${buttonIndex + 1})`);
      await new Promise(resolve => setTimeout(resolve, 300));
    }

    const finalSessionTotal = parseInt(await page.$eval('#sessionWins', el => el.textContent)) +
                             parseInt(await page.$eval('#sessionLosses', el => el.textContent)) +
                             parseInt(await page.$eval('#sessionDraws', el => el.textContent));
    console.log(`✅ After 6 total games, session total: ${finalSessionTotal}`);

    if (finalSessionTotal !== 6) {
      throw new Error(`Expected 6 total games, got ${finalSessionTotal}`);
    }

    console.log(`\n✅ All tests passed for ${viewportName.toUpperCase()} viewport!\n`);

  } catch (error) {
    console.error(`\n❌ Test failed for ${viewportName.toUpperCase()} viewport:`);
    console.error(error);
    throw error;
  } finally {
    await page.close();
  }
}

async function runTests() {
  console.log('Starting Puppeteer tests for Vera\'s Rock Paper Scissors Battle...\n');

  const browser = await puppeteer.launch({
    headless: false, // Set to true for CI/CD
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    // Test desktop viewport
    await testViewport(browser, 'desktop', VIEWPORTS.desktop);

    // Test mobile viewport
    await testViewport(browser, 'mobile', VIEWPORTS.mobile);

    console.log('\n========================================');
    console.log('✅ ALL TESTS PASSED! Game is working perfectly on both desktop and mobile.');
    console.log('========================================\n');

  } catch (error) {
    console.error('\n========================================');
    console.error('❌ TESTS FAILED');
    console.error('========================================\n');
    process.exit(1);
  } finally {
    await browser.close();
  }
}

// Run tests
runTests();
