/**
 * Run Lighthouse audit on Vera's Rock Paper Scissors Battle
 */

const lighthouse = require('lighthouse').default;
const chromeLauncher = require('chrome-launcher');
const fs = require('fs');

const GAME_URL = 'https://d2m7mlcoklgntq.cloudfront.net';

async function runLighthouse() {
  console.log('========== Running Lighthouse PWA Audit ==========\n');
  console.log(`Auditing: ${GAME_URL}\n`);

  // Launch Chrome
  const chrome = await chromeLauncher.launch({
    chromeFlags: ['--headless', '--no-sandbox']
  });

  const options = {
    logLevel: 'error',
    output: 'html',
    onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
    port: chrome.port
  };

  try {
    // Run Lighthouse
    const runnerResult = await lighthouse(GAME_URL, options);

    // Extract scores
    const { lhr } = runnerResult;

    console.log('========== Lighthouse Audit Results ==========\n');
    console.log(`Performance:     ${Math.round(lhr.categories.performance.score * 100)}/100`);
    console.log(`Accessibility:   ${Math.round(lhr.categories.accessibility.score * 100)}/100`);
    console.log(`Best Practices:  ${Math.round(lhr.categories['best-practices'].score * 100)}/100`);
    console.log(`SEO:             ${Math.round(lhr.categories.seo.score * 100)}/100`);
    console.log('\n========================================\n');

    // PWA-specific checks (manifest and service worker)
    const pwaChecks = {
      manifest: lhr.audits['installable-manifest'],
      serviceWorker: lhr.audits['service-worker'],
      offline: lhr.audits['works-offline'],
      splash: lhr.audits['splash-screen'],
      themed: lhr.audits['themed-omnibox']
    };

    console.log('PWA Features:\n');
    Object.entries(pwaChecks).forEach(([name, audit]) => {
      if (audit) {
        const status = audit.score === 1 ? '✅' : audit.score === 0 ? '❌' : '⚠️';
        console.log(`${status} ${audit.title}`);
        if (audit.score !== 1 && audit.description) {
          console.log(`   ${audit.description}\n`);
        }
      }
    });

    // Save HTML report
    const reportHtml = runnerResult.report;
    fs.writeFileSync('./lighthouse-report.html', reportHtml);
    console.log('\n✅ Full report saved to: lighthouse-report.html\n');

    // Overall assessment
    const avgScore = Math.round(
      (lhr.categories.performance.score +
       lhr.categories.accessibility.score +
       lhr.categories['best-practices'].score +
       lhr.categories.seo.score) / 4 * 100
    );

    const pwaFeaturesCount = Object.values(pwaChecks).filter(a => a && a.score === 1).length;
    const totalPwaFeatures = Object.values(pwaChecks).filter(a => a).length;

    console.log('========================================');
    console.log(`Overall Score: ${avgScore}/100`);
    console.log(`PWA Features: ${pwaFeaturesCount}/${totalPwaFeatures} passing`);

    if (avgScore >= 90 && pwaFeaturesCount === totalPwaFeatures) {
      console.log('🎉 EXCELLENT! This is a high-quality PWA.');
    } else if (avgScore >= 70 && pwaFeaturesCount >= totalPwaFeatures - 1) {
      console.log('✅ GOOD! Site is solid with PWA features.');
    } else {
      console.log('⚠️  Site could be improved.');
    }
    console.log('========================================\n');

  } catch (error) {
    console.error('❌ Lighthouse audit failed:', error);
    process.exit(1);
  } finally {
    await chrome.kill();
  }
}

// Run audit
runLighthouse();
