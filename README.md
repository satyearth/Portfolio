# Satyarth Ranjan — Personal Portfolio & CV Website

A modern, craft-driven developer CV and portfolio website optimized with **distinct desktop workstation and mobile app experiences**.

---

## 🌟 Key Features

### 🖥️ Desktop Experience (Screen Width ≥ 1024px)
- **Workstation Split-View**: Two-column layout with a fixed sticky sidebar and spacious content feed:
  - **Sticky Left Sidebar**:
    - **8-Directional Interactive Mascot**: Fluid pointer-tracking avatar sprite that tracks cursor movement across 8 radial directions with a center eye-contact deadzone.
    - Name, tagline, and comprehensive bio.
    - Core stack chips with authentic SVG tech icons.
    - Interactive navigation tab switcher (`Home`, `Projects`, `Articles`) with active indicator pills and counts.
    - **Quick Connect Card**: One-click **Copy Email** button with instant toast notification, plus social links.
    - Theme switcher (Light & Dark modes) with anti-FOUC state persistence.
    - Desktop keyboard shortcuts (`1`: Home, `2`: Projects, `3`: Articles, `T`: Switch theme, `F`: Spotlight, `C`: Copy email).
  - **Spacious Right Content Feed**:
    - Clean typographic cards for Experience, Education, Skills, and Highlights.
    - Multi-column project cards with category filter chips (`All`, `Data Analytics`, `Data Engineering`, `Python`, `3D & Simulation`).

### 📱 Mobile Experience (Screen Width < 1024px)
- **App-Native Feel**:
  - **Sticky Frosted Glass Top Bar**: Compact header with monogram, name, status, spotlight toggle, and theme toggle button.
  - **Thumb-Friendly Bottom Navigation Bar**: Fixed bottom tab bar (`Home`, `Projects`, `Articles`, `Connect`).
  - Smooth view transitions and tap-to-email.

### 🎨 Themes & Aesthetics
- **Light Theme**: Warm tactile paper background (`oklch`) with subtle borders and crisp typography.
- **Dark Theme**: Deep dark paper background with high-contrast surfaces and crisp borders.
- **🔦 The Real Dark Mode (Spotlight Mode)**:
  - Turns the entire page into a dark void where your cursor acts as a magical flashlight spotlight illuminating content.
  - Fully interactive: links, buttons, and filters are 100% clickable through the torch beam (`pointer-events: none`).
  - Mobile touch support: drag your finger to shine the torch beam across the screen.
  - Keyboard shortcuts: `F` to toggle, `Esc` to turn off, `[` and `]` to resize beam.
- **Typography**: Fraunces display serif & DM Mono typography with authentic paper grain overlay.
- **Zero CLS & Optimized Assets**: Explicit aspect ratios on media, optimized WebP/JPEG assets, and sub-100ms load times.

---

## 🚀 How to Run Locally

```bash
# Run local development server
npm start
# or npm run dev
```
Then visit [http://localhost:3000](http://localhost:3000).

```bash
# Run code quality & asset integrity validation
npm run lint

# Run production build verification
npm run build
```

---

## 📁 File Structure

```
c:/Users/Satya/Portfolio/
├── assets/
│   └── images/               # Optimized visual assets
│       ├── avatar.jpg        # 8-Directional 3x3 interactive avatar sprite (optimized)
│       ├── article-ai-data-analyst.jpg
│       ├── article-prompt-engineering.jpg
│       └── article-vibe-coding.jpg
├── css/
│   └── style.css             # Modular design tokens, typography, layouts, and spotlight HUD
├── js/
│   └── main.js               # Theme, navigation, project filters, spotlight physics, mascot tracking
├── scripts/
│   └── validate.js           # Production linting & asset integrity test suite
├── index.html                # Semantic HTML5 structure with accessible ARIA tab patterns
├── package.json              # Project scripts (dev, start, lint, build)
├── vercel.json               # Vercel deployment configuration
├── README.md                 # Project documentation
└── .gitignore                # Git ignore rules
```
