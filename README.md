# Vera's Rock Paper Scissors Battle

**Because ChatGPT Can't Play Fair — This Computer Actually Goes First**

A brutalist web-based Rock Paper Scissors game where the computer actually commits to its choice before you pick. Built because ChatGPT can't play Rock Paper Scissors fairly.

## 🎮 Play Now

**Live Game**: [https://d2m7mlcoklgntq.cloudfront.net](https://d2m7mlcoklgntq.cloudfront.net)

**Install as PWA**: Available on mobile (iOS/Android) and desktop (Chrome/Edge) - look for the install icon in your browser!

## 📖 The Story

Read the full story behind this game: [Building Vera's Rock Paper Scissors Battle](https://sparrowfm.github.io/sparrow/posts/building-veras-rock-paper-scissors-battle.html)

## ✨ Features

- **Progressive Web App**: Installable on mobile and desktop with offline support
- **Brutalist Design**: Thick black borders, monospace fonts, ALL CAPS, no animations
- **Fair Gameplay**: Computer uses `Math.random()` to commit BEFORE you choose
- **Session Scoring**: Tracks wins/losses/draws during current session
- **Persistent Scoring**: All-time stats saved via localStorage
- **Cheesy Messages**: Randomized Gen Z-inspired win/loss/draw messages
- **Mobile Responsive**: Optimized viewport fit for iPhone 16 and 13" MacBook Pro
- **HTTPS Secured**: Delivered via AWS CloudFront CDN
- **SEO Optimized**: Full meta tags and structured data for search engines
- **Analytics**: GoatCounter privacy-friendly analytics

### 📱 PWA Features

- **Installable**: Add to home screen on mobile, install as desktop app
- **Offline Support**: Service worker caches game for offline play
- **App-Like Experience**: Runs in standalone mode without browser chrome
- **Fast Loading**: Cached resources load instantly
- **3 Icon Sizes**: 192x192, 512x512, and Apple touch icon (180x180)

## 🛠️ Tech Stack

- **Pure HTML/CSS/JavaScript**: No frameworks, no build process
- **Single File**: Core game in `index.html` (~570 lines)
- **PWA Components**:
  - `manifest.json` - Web app manifest
  - `sw.js` - Service worker for offline support
  - Icon set (192x192, 512x512, Apple touch icon)
- **localStorage**: Persistent scoring without a database
- **AWS S3**: Static website hosting
- **AWS CloudFront**: HTTPS CDN delivery
- **GoatCounter**: Privacy-friendly analytics

## 📊 Performance

Lighthouse scores (as of latest audit):

- **Performance**: 100/100 ⚡
- **Accessibility**: 96/100 ♿
- **Best Practices**: 100/100 ✅
- **SEO**: 100/100 🔍
- **Overall**: 99/100 🎉

Run your own audit:
```bash
npm run lighthouse
```

## 🧪 Testing

```bash
# Install dependencies
npm install

# Run Puppeteer tests (desktop + mobile viewports)
npm test

# Run PWA functionality tests
npm run test:pwa

# Run Lighthouse audit
npm run lighthouse
```

The test suites include:

**Main Tests** (`npm test`):
- Page load verification
- Element presence checks
- Gameplay functionality testing
- Score tracking validation
- Mobile responsiveness testing
- Screenshot capture for both viewports

**PWA Tests** (`npm run test:pwa`):
- HTTPS connection verification
- Manifest.json accessibility
- Service worker registration
- PWA icon availability
- Meta tags validation
- Offline functionality

## 📲 PWA Installation

### On Mobile (iOS/Android)

**iOS (Safari)**:
1. Visit [https://d2m7mlcoklgntq.cloudfront.net](https://d2m7mlcoklgntq.cloudfront.net)
2. Tap the Share button (square with arrow)
3. Tap "Add to Home Screen"
4. Tap "Add"

**Android (Chrome)**:
1. Visit [https://d2m7mlcoklgntq.cloudfront.net](https://d2m7mlcoklgntq.cloudfront.net)
2. Tap the menu (three dots)
3. Tap "Install app" or "Add to Home screen"
4. Tap "Install"

### On Desktop (Chrome/Edge)

1. Visit [https://d2m7mlcoklgntq.cloudfront.net](https://d2m7mlcoklgntq.cloudfront.net)
2. Look for the install icon (⊕ or computer icon) in the address bar
3. Click "Install"
4. Or use menu → "Install Vera's Rock Paper Scissors Battle"

The app will open in its own window without browser UI!

## 🚀 Local Development

1. Clone the repository:
```bash
git clone https://github.com/sparrowfm/veras-rps-battle.git
cd veras-rps-battle
```

2. Open `index.html` in your browser:
```bash
open index.html
```

That's it! No build process required.

**Note**: PWA features (service worker, installation) require HTTPS, so they won't work when opening the file directly. Use the live site or set up a local HTTPS server for PWA testing.

## 📸 Screenshots

Run the tests to generate screenshots for desktop and mobile viewports:
```bash
npm test
```

Screenshots will be saved as:
- `screenshot-desktop.png` (1920x1080)
- `screenshot-mobile.png` (375x812)

## 🎨 Design Philosophy

**KISS (Keep It Simple, Stupid)** and **YAGNI (You Aren't Gonna Need It)**

What we built:
- ✅ Three buttons: Rock, Paper, Scissors
- ✅ Randomized computer choice
- ✅ Session and all-time scoring
- ✅ Cheesy messages
- ✅ Brutalist styling
- ✅ Mobile responsive
- ✅ Progressive Web App (installable, offline support)
- ✅ HTTPS delivery via CloudFront

What we did NOT build:
- ❌ Animations or transitions
- ❌ Sound effects
- ❌ Difficulty levels
- ❌ Best-of-X rounds
- ❌ Multiplayer
- ❌ Game history or replays
- ❌ User accounts or login
- ❌ Frameworks or complex build tools

## 📝 License

MIT © 2025 Neel Ketkar

## 🙏 Credits

Built with [Claude Code](https://claude.com/claude-code) via [Happy](https://happy.engineering)

Co-Authored-By: Claude <noreply@anthropic.com>
Co-Authored-By: Happy <yesreply@happy.engineering>
