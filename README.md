# Satyarth Ranjan — Personal Portfolio & CV Website

A modern, responsive developer CV and portfolio optimized with **distinct desktop and mobile experiences**.

---

## 🌟 Key Features

### 🖥️ Desktop Experience (Screen Width ≥ 1024px)
- **Workstation Split-View**: Two-column layout with a fixed sticky sidebar and spacious content feed:
  - **Sticky Left Sidebar**:
    - Monogram badge with online availability indicator.
    - Name, tagline, and comprehensive bio.
    - Interactive navigation tab switcher (`Home`, `Projects`, `Articles`) with active indicator pills and counts.
    - **Quick Connect Card**: One-click **Copy Email** button with instant toast notification, plus social links.
    - Theme switcher (Light & Dark modes).
    - Desktop keyboard shortcuts (`1`: Home, `2`: Projects, `3`: Articles, `T`: Switch theme, `C`: Copy email).
  - **Spacious Right Content Feed**:
    - Clean typographic cards for Experience, Education, Skills, and Highlights.
    - Multi-column project cards with category filter chips.

### 📱 Mobile Experience (Screen Width < 1024px)
- **App-Native Feel**:
  - **Sticky Frosted Glass Top Bar**: Compact header with monogram, name, and theme toggle button.
  - **Thumb-Friendly Bottom Navigation Bar**: Fixed bottom tab bar (`Home`, `Projects`, `Posts`, `Connect`).
  - Smooth view transitions and tap-to-email.

### 🎨 Themes & Aesthetics
- **Light Theme**: Clean off-white background with subtle borders and crisp typography.
- **Dark Theme**: Deep dark background with high-contrast surfaces and crisp borders.
- **🔦 The Real Dark Mode (Flashlight Mode)**:
  - Inspired by [the-real-dark-mode](https://github.com/Pankajtanwarbanna/the-real-dark-mode).
  - Turns the entire page into a dark void where your cursor acts as a magical flashlight spotlight illuminating content!
  - Fully interactive: links, buttons, and filters are 100% clickable through the torch beam (`pointer-events: none`).
  - Mobile touch support: drag your finger to shine the torch beam across the screen.
  - Floating glassmorphic HUD to adjust flashlight beam radius or exit.
  - Keyboard shortcuts: `F` to toggle, `Esc` to turn off, `[` and `]` to resize beam.
- Google Sans, Google Sans Text, and JetBrains Mono typography.
- Lightweight and fast load times.

---

## 🚀 How to Run Locally

```bash
npm start
```
Then visit [http://localhost:3000](http://localhost:3000).

---

## 📁 File Structure

```
c:/Users/Satya/Portfolio/
├── index.html        # Semantic HTML5 structure with desktop & mobile components
├── style.css         # Custom design system & responsive layout
├── main.js           # Dynamic view switching, tag filtering, theme toggle, copy email
├── avatar.jpg        # Interactive look-direction avatar sprite
├── package.json      # Dev server scripts
└── .gitignore        # Git ignore rules
```
