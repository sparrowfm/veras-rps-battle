# Vera's Rock Paper Scissors Battle

**Because ChatGPT Can't Play Fair — This Computer Actually Goes First**

A brutalist web-based Rock Paper Scissors game where the computer actually commits to its choice before you pick. Built because ChatGPT can't play Rock Paper Scissors fairly.

## 🎮 Play Now

**Live Game**: [http://veras-rps-battle-1761624731.s3-website-us-east-1.amazonaws.com](http://veras-rps-battle-1761624731.s3-website-us-east-1.amazonaws.com)

## 📖 The Story

Read the full story behind this game: [Building Vera's Rock Paper Scissors Battle](https://sparrowfm.github.io/sparrow/posts/building-veras-rock-paper-scissors-battle.html)

## ✨ Features

- **Brutalist Design**: Thick black borders, monospace fonts, ALL CAPS, no animations
- **Fair Gameplay**: Computer uses `Math.random()` to commit BEFORE you choose
- **Session Scoring**: Tracks wins/losses/draws during current session
- **Persistent Scoring**: All-time stats saved via localStorage
- **Cheesy Messages**: Randomized Gen Z-inspired win/loss/draw messages
- **Mobile Responsive**: Works on desktop and mobile viewports
- **SEO Optimized**: Full meta tags and structured data for search engines
- **Analytics**: GoatCounter privacy-friendly analytics

## 🛠️ Tech Stack

- **Pure HTML/CSS/JavaScript**: No frameworks, no build process
- **Single File**: Everything in one `index.html` (~500 lines)
- **localStorage**: Persistent scoring without a database
- **AWS S3**: Static website hosting
- **GoatCounter**: Privacy-friendly analytics

## 🧪 Testing

```bash
# Install dependencies
npm install

# Run Puppeteer tests (desktop + mobile viewports)
npm test
```

The test suite includes:
- Page load verification
- Element presence checks
- Gameplay functionality testing
- Score tracking validation
- Mobile responsiveness testing
- Screenshot capture for both viewports

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

What we did NOT build:
- ❌ Animations or transitions
- ❌ Sound effects
- ❌ Difficulty levels
- ❌ Best-of-X rounds
- ❌ Multiplayer
- ❌ Game history
- ❌ Frameworks or build tools

## 📝 License

MIT © 2025 Neel Ketkar

## 🙏 Credits

Built with [Claude Code](https://claude.com/claude-code) via [Happy](https://happy.engineering)

Co-Authored-By: Claude <noreply@anthropic.com>
Co-Authored-By: Happy <yesreply@happy.engineering>
