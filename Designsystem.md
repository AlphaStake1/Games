# Football Squares Website Style Guide & Implementation Plan

## 🎯 Design Vision

Transform your Football Squares website into a "photocopied whiteboard" experience with hand-drawn aesthetics, minimal text, and buttery-smooth performance across all devices.

## 📋 Core Design Principles

### Visual Identity

- **Monochrome Foundation**: Pure white (#fff) and near-black (#111) as primary colors
- **Xerox Copy Aesthetic**: Faded, slightly imperfect lines mimicking photocopied documents
- **Hand-Drawn Elements**: Scribbly borders, sketch-style icons, and organic shapes
- **Minimal Color**: Only subtle team accents at 10-20% opacity
- **Performance First**: Sub-1 second load times on mobile

## 🎨 Color System & CSS Variables

```css
/* Core Design Tokens */
:root {
  /* Primary Colors */
  --ink: #111111;
  --paper: #ffffff;
  --paper-off: #fafafa;

  /* Notion-inspired Accents (10-20% opacity) */
  --accent-blue: hsla(222, 33%, 70%, 0.16);
  --accent-violet: hsla(269, 27%, 78%, 0.14);
  --accent-green: hsla(142, 33%, 70%, 0.12);

  /* Team Colors (semi-transparent) */
  --team-1: rgba(0, 78, 54, 0.1); /* Eagles Green */
  --team-2: rgba(0, 34, 68, 0.1); /* Cowboys Blue */

  /* Functional Colors */
  --success: #28a745;
  --error: #dc3545;
  --warning: #ffc107;

  /* Borders & Surfaces */
  --border-light: #e0e0e0;
  --surface: #f5f5f5;
  --text-secondary: #5a5a5a;
}

/* Dark Mode */
@media (prefers-color-scheme: dark) {
  :root {
    --ink: #eeeeee;
    --paper: #000000;
    --paper-off: #0a0a0a;
    --accent-blue: hsla(222, 33%, 60%, 0.22);
    --accent-violet: hsla(269, 27%, 68%, 0.2);
    --accent-green: hsla(142, 33%, 60%, 0.18);
    --team-1: rgba(0, 78, 54, 0.3);
    --team-2: rgba(0, 34, 68, 0.3);
    --border-light: #333333;
    --surface: #1a1a1a;
    --text-secondary: #a3a3a3;
  }
}
```

## 🔤 Typography Strategy

### Font Implementation

Use **KaTeX** for dynamic font rendering and **Recursive Mono Casual** as fallback:

```css
/* Typography System */
.font-primary {
  font-family: 'Recursive', monospace;
  font-variation-settings:
    'MONO' 0.5,
    'CASL' 0.8;
}

.font-handwritten {
  font-family: 'Recursive', monospace;
  font-variation-settings:
    'MONO' 0.2,
    'CASL' 1;
  font-weight: 400;
}

.font-board-numbers {
  font-family: 'Recursive', monospace;
  font-variation-settings:
    'MONO' 0.8,
    'CASL' 0.3;
  font-weight: 500;
}

/* Responsive Typography */
body {
  font-size: clamp(15px, 3.5vw, 18px);
  line-height: 1.6;
}

h1 {
  font-size: clamp(1.8rem, 5vw, 2.5rem);
}
h2 {
  font-size: clamp(1.5rem, 4vw, 2rem);
}
h3 {
  font-size: clamp(1.2rem, 3vw, 1.5rem);
}
```

## 🏗️ Layout Structure

### HTML Foundation

```html
<body
  class="grid h-screen grid-rows-[auto_1fr_auto] font-primary bg-paper text-ink"
>
  <header class="header-doodle">
    <h1 class="logo-doodle">Football Squares</h1>
    <nav class="nav-doodle">
      <a href="#board" class="link-doodle">Board</a>
      <a href="#rules" class="link-doodle">Rules</a>
      <a href="#wallet" class="link-doodle">Wallet</a>
    </nav>
  </header>

  <main class="main-content">
    <!-- Team Headers -->
    <section class="team-headers">
      <div class="team-header team-1-bg">
        <span class="team-name">Eagles</span>
        <div class="team-numbers"></div>
      </div>
      <div class="team-header team-2-bg">
        <span class="team-name">Cowboys</span>
        <div class="team-numbers"></div>
      </div>
    </section>

    <!-- Football Squares Grid -->
    <section id="board" class="board-container">
      <div class="squares-grid">
        <!-- 100 squares generated dynamically -->
      </div>
    </section>

    <!-- Mobile Bottom Navigation -->
    <nav class="mobile-nav">
      <button class="nav-btn active">Board</button>
      <button class="nav-btn">My Squares</button>
      <button class="nav-btn">Wallet</button>
    </nav>
  </main>

  <footer class="footer-doodle">
    <p>© 2025 Football Squares</p>
  </footer>
</body>
```

## 🎨 CSS Component Classes

### Hand-Drawn Elements

```css
/* Scribbled Borders */
.border-doodle {
  border: 2px solid var(--ink);
  border-image: url('/assets/scribble-border.svg') 6 stretch;
  position: relative;
}

.border-doodle::after {
  content: '';
  position: absolute;
  top: -1px;
  left: -1px;
  right: -1px;
  bottom: -1px;
  background: url('/assets/paper-texture.svg');
  opacity: 0.05;
  pointer-events: none;
}

/* Header Styling */
.header-doodle {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  border-bottom: 3px solid var(--ink);
  border-image: url('/assets/scribble-border.svg') 5 round;
  background: var(--paper-off);
}

.logo-doodle {
  font-size: 1.8rem;
  font-weight: 600;
  font-variation-settings:
    'MONO' 0.3,
    'CASL' 0.9;
}

/* Navigation Links */
.link-doodle {
  position: relative;
  text-decoration: none;
  color: var(--ink);
  font-weight: 500;
  transition: all 0.3s ease;
}

.link-doodle::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: -2px;
  width: 100%;
  height: 2px;
  background: var(--ink);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.3s ease;
}

.link-doodle:hover::after {
  transform: scaleX(1);
}

/* Team Headers */
.team-headers {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin: 2rem 0;
  padding: 0 2rem;
}

.team-header {
  padding: 1rem;
  border-radius: 8px;
  text-align: center;
  border: 2px solid var(--ink);
  border-image: url('/assets/scribble-border.svg') 4 stretch;
}

.team-1-bg {
  background: var(--team-1);
}
.team-2-bg {
  background: var(--team-2);
}

.team-name {
  font-size: 1.3rem;
  font-weight: 600;
  font-variation-settings:
    'MONO' 0.4,
    'CASL' 0.8;
}

/* Football Squares Grid */
.board-container {
  display: flex;
  justify-content: center;
  padding: 2rem;
  overflow-x: auto;
}

.squares-grid {
  display: grid;
  grid-template-columns: repeat(10, clamp(35px, 8vw, 60px));
  gap: 2px;
  filter: contrast(1.1);
  background: var(--paper);
  padding: 1rem;
  border: 3px solid var(--ink);
  border-image: url('/assets/scribble-border.svg') 6 stretch;
}

.square {
  aspect-ratio: 1;
  background: var(--paper);
  border: 1.5px solid var(--ink);
  border-image: url('/assets/scribble-border.svg') 3 stretch;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-variation-settings:
    'MONO' 0.8,
    'CASL' 0.5;
}

.square:hover {
  background: var(--accent-blue);
  transform: scale(1.05);
}

.square.claimed {
  background: var(--accent-green);
  font-weight: 600;
}

.square.winning {
  background: var(--success);
  color: white;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}
```

## 📱 Mobile Optimization

### Responsive Design

```css
/* Mobile-First Grid */
@media (max-width: 768px) {
  .squares-grid {
    grid-template-columns: repeat(10, clamp(28px, 9vw, 45px));
    gap: 1px;
    padding: 0.5rem;
  }

  .team-headers {
    grid-template-columns: 1fr;
    gap: 1rem;
    margin: 1rem 0;
  }

  .header-doodle {
    padding: 0.5rem 1rem;
  }
}

/* Mobile Navigation */
.mobile-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-around;
  background: var(--paper-off);
  border-top: 2px solid var(--ink);
  padding: 1rem 0;
  z-index: 1000;
}

.nav-btn {
  background: none;
  border: none;
  color: var(--ink);
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.nav-btn.active {
  background: var(--accent-blue);
  color: var(--ink);
}

/* Hide on desktop */
@media (min-width: 769px) {
  .mobile-nav {
    display: none;
  }
}
```

## ✨ Interactive Elements

### Football Cursor Trail

```javascript
// cursor-football.js
class FootballCursor {
  constructor() {
    this.trail = [];
    this.maxTrailLength = 8;
    this.init();
  }

  init() {
    // Create football cursor
    this.cursor = document.createElement('div');
    this.cursor.className = 'football-cursor';
    this.cursor.innerHTML = '🏈';
    document.body.appendChild(this.cursor);

    // Mouse tracking
    document.addEventListener('mousemove', (e) => {
      this.updateCursor(e.clientX, e.clientY);
      this.updateTrail(e.clientX, e.clientY);
    });

    // Hide on mobile
    if (window.innerWidth <= 768) {
      this.cursor.style.display = 'none';
    }
  }

  updateCursor(x, y) {
    this.cursor.style.left = `${x - 12}px`;
    this.cursor.style.top = `${y - 12}px`;
  }

  updateTrail(x, y) {
    this.trail.push({ x, y, time: Date.now() });

    if (this.trail.length > this.maxTrailLength) {
      this.trail.shift();
    }

    this.renderTrail();
  }

  renderTrail() {
    // Remove old trail elements
    document.querySelectorAll('.trail-dot').forEach((dot) => dot.remove());

    // Create new trail
    this.trail.forEach((point, index) => {
      const dot = document.createElement('div');
      dot.className = 'trail-dot';
      dot.style.left = `${point.x}px`;
      dot.style.top = `${point.y}px`;
      dot.style.opacity = (index / this.trail.length) * 0.5;
      dot.style.transform = `scale(${index / this.trail.length})`;
      document.body.appendChild(dot);
    });
  }
}

// CSS for cursor
const cursorStyles = `
.football-cursor {
  position: fixed;
  pointer-events: none;
  z-index: 9999;
  font-size: 20px;
  user-select: none;
  transition: transform 0.1s ease;
}

.trail-dot {
  position: fixed;
  width: 4px;
  height: 4px;
  background: var(--ink);
  border-radius: 50%;
  pointer-events: none;
  z-index: 9998;
  transition: opacity 0.2s ease;
}

@media (prefers-reduced-motion: reduce) {
  .football-cursor,
  .trail-dot {
    display: none;
  }
}
`;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  const style = document.createElement('style');
  style.textContent = cursorStyles;
  document.head.appendChild(style);

  new FootballCursor();
});
```

## 🎭 Hand-Drawn SVG Assets

### Required SVG Files

Create these SVG files in your `/assets` folder:

1. **scribble-border.svg** - Hand-drawn border pattern
2. **paper-texture.svg** - Subtle paper texture overlay
3. **football-helmet.svg** - Team helmet icons
4. **x-o-pattern.svg** - Background X's and O's pattern

### Example Scribble Border SVG

```svg
<svg width="100" height="20" viewBox="0 0 100 20" xmlns="http://www.w3.org/2000/svg">
  <path d="M2,10 Q25,5 50,10 T98,10"
        stroke="currentColor"
        stroke-width="2"
        fill="none"
        stroke-linecap="round"/>
</svg>
```

## 🚀 Performance Optimizations

### Critical Performance Checklist

- [ ] Single CSS file < 35KB after purification
- [ ] Inline critical SVGs to avoid extra requests
- [ ] Lazy load animations and non-critical assets
- [ ] Use `loading="lazy"` on images
- [ ] Implement service worker for offline capability
- [ ] Compress all assets with gzip/brotli
- [ ] Optimize font loading with `font-display: swap`

### JavaScript Bundle Strategy

```javascript
// Main bundle (critical)
import './styles/main.css';
import { FootballCursor } from './cursor-football.js';
import { SquareGrid } from './square-grid.js';

// Lazy load animations
const loadAnimations = () => {
  import('./animations/lottie-loader.js').then((module) => {
    module.initializeAnimations();
  });
};

// Initialize on interaction
document.addEventListener('click', loadAnimations, { once: true });
```

## 📋 Implementation Steps

### Phase 1: Foundation (Week 1)

1. Set up CSS variables and color system
2. Implement responsive grid layout
3. Create hand-drawn SVG assets
4. Add basic typography system

### Phase 2: Interactive Elements (Week 2)

1. Implement football cursor trail
2. Add square selection functionality
3. Create mobile navigation
4. Add hover effects and micro-interactions

### Phase 3: Polish & Performance (Week 3)

1. Optimize asset loading
2. Add animations and transitions
3. Implement dark mode toggle
4. Performance testing and optimization

### Phase 4: Testing & Launch (Week 4)

1. Cross-browser testing
2. Mobile device testing
3. Accessibility audit
4. Final performance optimization

## 🎯 Success Metrics

- **Load Time**: < 1 second on 3G
- **Lighthouse Score**: 90+ across all categories
- **Mobile Usability**: 100% score
- **Accessibility**: WCAG 2.1 AA compliant
- **User Engagement**: Increased time on site

## 📚 Resources & References

- [Notion Color Palette](https://matthiasfrank.de/notion-colors/)
- [Lindy.ai Design System](https://lindy.ai)
- [LottieFiles Animations](https://lottiefiles.com/)
- [Dribbble Micro-Interactions](https://dribbble.com/shots/popular/animation)
- [KaTeX Documentation](https://katex.org/)

This comprehensive style guide provides everything needed to transform your Football Squares website into a unique, performant, and engaging platform that captures the nostalgic charm of hand-drawn football boards while delivering a modern web experience.

## NFL Team HEX Color Codes (Primary & Secondary)

**Baltimore Ravens**: Purple `#241773`, Black `#000000`, Gold `#9E7C0C`, Red `#C60C30`
**Cincinnati Bengals**: Orange `#FB4F14`, Black `#000000`
**Cleveland Browns**: Brown `#311D00`, Orange `#FF3C00`
**Pittsburgh Steelers**: Steelers Gold `#FFB612`, Black `#101820`, Blue `#003087`, Red `#C60C30`, Silver `#A5ACAF`
**Buffalo Bills**: Blue `#00338D`, Red `#C60C30`
**Miami Dolphins**: Aqua `#008E97`, Orange `#FC4C02`, Blue `#005778`
**New England Patriots**: Nautical Blue `#002244`, Red `#C60C30`, New Century Silver `#B0B7BC`
**New York Jets**: Gotham Green `#125740`, Stealth Black `#000000`, Spotlight White `#FFFFFF`
**Houston Texans**: Deep Steel Blue `#03202F`, Battle Red `#A71930`
**Indianapolis Colts**: Speed Blue `#002C5F`, Gray `#A2AAAD`
**Jacksonville Jaguars**: Black `#101820`, Gold `#D7A22A`, Dark Gold `#9F792C`, Teal `#006778`
**Tennessee Titans**: Titans Navy `#0C2340`, Titans Blue `#4B92DB`, Titans Red `#C8102E`, Titans Silver `#8A8D8F`
**Denver Broncos**: Broncos Orange `#FB4F14`, Broncos Navy `#002244`
**Kansas City Chiefs**: Red `#E31837`, Gold `#FFB81C`
**Las Vegas Raiders**: Raiders Black `#000000`, Raiders Silver `#A5ACAF`
**Los Angeles Chargers**: Powder Blue `#0080C6`, Sunshine Gold `#FFC20E`, White `#FFFFFF`
**Chicago Bears**: Dark Navy `#0B162A`, Orange `#C83803`
**Detroit Lions**: Honolulu Blue `#0076B6`, Silver `#B0B7BC`, Black `#000000`, White `#FFFFFF`
**Green Bay Packers**: Dark Green `#203731`, Gold `#FFB612`
**Minnesota Vikings**: Purple `#4F2683`, Gold `#FFC62F`
**Dallas Cowboys**: Royal Blue `#003594`, Blue `#041E42`, Silver `#869397`, Silver-Green `#7F9695`, White `#FFFFFF`
**New York Giants**: Dark Blue `#0B2265`, Red `#A71930`, Gray `#A5ACAF`
**Philadelphia Eagles**: Midnight Green `#004C54`, Silver (Jersey) `#A5ACAF`, Silver (Helmet) `#ACC0C6`, Black `#000000`, Charcoal `#565A5C`
**Washington Commanders**: Burgundy `#5A1414`, Gold `#FFB612`
**Atlanta Falcons**: Red `#A71930`, Black `#000000`, Silver `#A5ACAF`
**Carolina Panthers**: Carolina Blue `#0085CA`, Black `#101820`, Silver `#BFC0BF`
**New Orleans Saints**: Old Gold `#D3BC8D`, Black `#101820`
**Tampa Bay Buccaneers**: Red `#D50A0A`, Bay Orange `#FF7900`, Black `#0A0A08`, Grey `#B1BABF`, Pewter `#34302B`
**Arizona Cardinals**: Red `#97233F`, Black `#000000`, Yellow `#FFB612`
**Los Angeles Rams**: Blue `#003594`, Gold `#FFA300`, Dark Gold `#FF8200`, Yellow `#FFD100`, White `#FFFFFF`
**San Francisco 49ers**: 49ers Red `#AA0000`, Gold `#B3995D`
**Seattle Seahawks**: College Navy `#002244`, Action Green `#69BE28`, Wolf Gray `#A5ACAF`
