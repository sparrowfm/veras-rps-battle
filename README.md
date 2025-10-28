# Vera's Rock Paper Scissors Battle

**Because ChatGPT Can't Play Fair — This Computer Actually Goes First**

A brutalist web-based Rock Paper Scissors game where the computer actually commits to its choice before you pick. Built because ChatGPT can't play Rock Paper Scissors fairly.

## 🎮 Play Now

**Live Game**: [https://d2m7mlcoklgntq.cloudfront.net](https://d2m7mlcoklgntq.cloudfront.net)

**Install as PWA**: Available on mobile (iOS/Android) and desktop (Chrome/Edge) - look for the install icon in your browser!

## 📖 The Story

**Built for Vera** - A Gen Z-friendly Rock Paper Scissors game with brutalist design, Y2K cyber aesthetics, and neon dark mode. Created because ChatGPT couldn't play Rock Paper Scissors fairly (it can't commit to a choice before you pick). This computer actually uses `Math.random()` to decide BEFORE you choose.

## ✨ Features

- **Progressive Web App**: Installable on mobile and desktop with offline support
- **3 Theme System**: Switch between Brutalist, Y2K Cyber, and Neon Dark themes
- **Fair Gameplay**: Computer uses `Math.random()` to commit BEFORE you choose
- **Session Scoring**: Tracks wins/losses/draws during current session
- **Persistent Scoring**: All-time stats saved via localStorage
- **Cheesy Messages**: Randomized Gen Z-inspired win/loss/draw messages
- **Smart Install Banner**: Sticky bottom banner with bounce animation, intelligent session tracking
- **iOS Install UX**: Visual overlay tutorial for iOS users with step-by-step instructions
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
- **iOS Install Tutorial**: Visual overlay with animated arrow and step-by-step instructions
- **Smart Banner**: Sticky bottom banner appears on first visit, reappears after 10 sessions if dismissed

### 🎨 Theme System

Choose your vibe with 3 distinct themes (toggle in top-right corner):

**🖤 Brutalist** (Default)
- Stark black and white
- Thick 5px borders
- Monospace fonts
- Zero animations
- Sharp corners (no border-radius)

**💜 Y2K Cyber**
- Purple/pink/cyan gradients
- Glossy buttons with backdrop blur
- 20px rounded corners
- Smooth transitions
- Gradient text effects
- Box shadows with color

**💚 Neon Dark**
- Dark background (#0f0f23)
- Neon green (#00ff9f) and pink (#ff00ff)
- Glowing text and buttons
- Pulsing animations
- 10px rounded corners
- Cyberpunk aesthetic

Theme choice persists in localStorage across sessions.

## 🛠️ Tech Stack

- **Pure HTML/CSS/JavaScript**: No frameworks, no build process
- **Single File**: Core game in `index.html` (~1100 lines with 3 themes)
- **CSS Variables**: Dynamic theming system with `data-theme` attribute
- **PWA Components**:
  - `manifest.json` - Web app manifest
  - `sw.js` - Service worker for offline support
  - Icon set (192x192, 512x512, Apple touch icon)
- **localStorage**: Persistent scoring, theme choice, and banner dismissal
- **AWS S3**: Static website hosting
- **AWS CloudFront**: HTTPS CDN delivery with HTTP→HTTPS redirect
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

# Run full regression suite
node test-full-regression.js

# Test theme system
node test-themes.js

# Test iOS install overlay
node test-ios-overlay.js

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

**Full Regression** (`test-full-regression.js`):
- HTTP → HTTPS redirect verification
- Complete game functionality
- Install banner behavior
- PWA feature validation

**Theme Tests** (`test-themes.js`):
- Theme toggle functionality
- CSS variable updates
- localStorage persistence
- Theme restoration after reload

**iOS Overlay Tests** (`test-ios-overlay.js`):
- iOS device detection
- Overlay trigger on install button
- Visual tutorial content
- Close functionality
- Android vs iOS behavior

## 📲 PWA Installation

### On Mobile (iOS/Android)

**iOS (Safari)** - Enhanced Experience:
1. Visit [https://d2m7mlcoklgntq.cloudfront.net](https://d2m7mlcoklgntq.cloudfront.net)
2. You'll see a sticky banner at the bottom - tap "INSTALL"
3. A visual tutorial overlay appears with animated arrow and step-by-step instructions:
   - Tap the Share button ⬆️ at the bottom
   - Scroll down and tap "Add to Home Screen"
   - Tap "Add" to complete installation
4. The app icon appears on your home screen!

**Android (Chrome)**:
1. Visit [https://d2m7mlcoklgntq.cloudfront.net](https://d2m7mlcoklgntq.cloudfront.net)
2. You'll see a sticky banner at the bottom - tap "INSTALL"
3. Native install prompt appears
4. Tap "Install"

**Smart Banner Behavior**:
- Appears on every visit until you dismiss it
- If dismissed, reappears after 10 sessions
- Hidden automatically when app is already installed
- Adapts to your chosen theme

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
- ✅ 3 distinct theme styles (Brutalist, Y2K Cyber, Neon Dark)
- ✅ Mobile responsive with iOS-specific install UX
- ✅ Progressive Web App (installable, offline support)
- ✅ Smart install banner with session tracking
- ✅ HTTPS delivery via CloudFront with HTTP redirect
- ✅ CSS variable-based theming system

What we did NOT build:
- ❌ Sound effects
- ❌ Difficulty levels or AI opponents
- ❌ Best-of-X rounds
- ❌ Multiplayer
- ❌ Game history or replays
- ❌ User accounts or login
- ❌ Backend server or database
- ❌ Frameworks or complex build tools

## 📝 License

MIT © 2025 Neel Ketkar

## 🙏 Credits

Built with [Claude Code](https://claude.com/claude-code) via [Happy](https://happy.engineering)

Co-Authored-By: Claude <noreply@anthropic.com>
Co-Authored-By: Happy <yesreply@happy.engineering>
