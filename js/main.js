/**
 * Satyarth Ranjan — Portfolio & CV
 * Craft-driven developer portfolio with workstation desktop & mobile app experience.
 * Modules: Theme, View Switcher, Project Filter, Copy Email, Fade Animations,
 * Spotlight Mode (The Real Dark Mode), and 8-Directional Interactive Mascot.
 */

'use strict';

// ============================================================================
// 1. Storage & Theme System
// ============================================================================
const Storage = {
  get(key) {
    try {
      return localStorage.getItem(key) || sessionStorage.getItem(key);
    } catch (_) {
      return null;
    }
  },
  set(key, val) {
    try {
      localStorage.setItem(key, val);
    } catch (_) {}
    try {
      sessionStorage.setItem(key, val);
    } catch (_) {}
  }
};

const THEME_KEY = 'portfolio_theme';

function applyTheme(theme) {
  const target = theme === 'dark' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', target);

  // Update dynamic meta theme-color for browser address bar styling
  const metaTheme = document.querySelector('meta[name="theme-color"]:not([media])');
  if (metaTheme) {
    metaTheme.setAttribute('content', target === 'dark' ? '#272420' : '#f8f7f4');
  }

  // Update aria attributes on theme toggle buttons
  const themeButtons = [
    document.getElementById('theme-toggle-desktop'),
    document.getElementById('theme-toggle-mobile')
  ];
  themeButtons.forEach((btn) => {
    if (btn) {
      btn.setAttribute('aria-label', `Switch to ${target === 'dark' ? 'light' : 'dark'} mode`);
      btn.setAttribute('title', `Switch to ${target === 'dark' ? 'light' : 'dark'} mode (Press T)`);
    }
  });
}

function initTheme() {
  // Always open in light theme by default as requested
  applyTheme('light');
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme') || 'light';
  const target = current === 'dark' ? 'light' : 'dark';
  applyTheme(target);
  showToast(`Switched to ${target} mode`);
}

// ============================================================================
// 2. View Switcher & Navigation
// ============================================================================
const VIEWS = ['home', 'projects', 'posts'];

function showView(view) {
  if (!VIEWS.includes(view)) return;

  // 1. Toggle View Panels
  VIEWS.forEach((v) => {
    const el = document.getElementById(`view-${v}`);
    if (el) {
      const isActive = v === view;
      el.classList.toggle('active', isActive);
      el.setAttribute('aria-hidden', String(!isActive));
    }
  });

  // 2. Desktop Navigation Tabs
  const deskTabs = {
    home: document.getElementById('nav-home'),
    projects: document.getElementById('nav-projects'),
    posts: document.getElementById('nav-posts')
  };
  Object.keys(deskTabs).forEach((key) => {
    const tab = deskTabs[key];
    if (tab) {
      const isSelected = key === view;
      tab.classList.toggle('active', isSelected);
      tab.setAttribute('aria-selected', String(isSelected));
    }
  });

  // 3. Mobile Navigation Tabs
  const mobTabs = {
    home: document.getElementById('mob-nav-home'),
    projects: document.getElementById('mob-nav-projects'),
    posts: document.getElementById('mob-nav-posts')
  };
  Object.keys(mobTabs).forEach((key) => {
    const tab = mobTabs[key];
    if (tab) {
      const isSelected = key === view;
      tab.classList.toggle('active', isSelected);
      tab.setAttribute('aria-selected', String(isSelected));
    }
  });

  const mobConnect = document.getElementById('mob-nav-connect');
  if (mobConnect) {
    mobConnect.classList.remove('active');
    mobConnect.setAttribute('aria-selected', 'false');
  }

  // 4. Smooth Scroll to top & trigger element reveal
  window.scrollTo({ top: 0, behavior: 'smooth' });
  triggerFades();
}

function scrollToConnect() {
  const homeView = document.getElementById('view-home');
  const isHomeActive = homeView ? homeView.classList.contains('active') : false;

  if (!isHomeActive) {
    showView('home');
    // Allow brief layout tick for view to display before scrolling
    requestAnimationFrame(() => {
      setTimeout(performScrollToConnect, 80);
    });
  } else {
    performScrollToConnect();
  }

  // Update active state on mobile bottom nav
  const mobTabs = document.querySelectorAll('.mob-tab');
  mobTabs.forEach((tab) => {
    tab.classList.remove('active');
    tab.setAttribute('aria-selected', 'false');
  });

  const mobConnect = document.getElementById('mob-nav-connect');
  if (mobConnect) {
    mobConnect.classList.add('active');
    mobConnect.setAttribute('aria-selected', 'true');
  }
}

function performScrollToConnect() {
  const connectSec = document.getElementById('connect-section');
  if (connectSec) {
    connectSec.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}

// ============================================================================
// 3. Project Filter
// ============================================================================
function filterProjects(filterTag, btn) {
  const buttons = document.querySelectorAll('.filter-btn');
  buttons.forEach((b) => {
    b.classList.remove('active');
    b.setAttribute('aria-pressed', 'false');
  });

  if (btn) {
    btn.classList.add('active');
    btn.setAttribute('aria-pressed', 'true');
  }

  const cards = document.querySelectorAll('.project-card');
  cards.forEach((card) => {
    const tags = card.getAttribute('data-tags') || '';
    if (filterTag === 'all' || tags.includes(filterTag)) {
      card.classList.remove('filtered-out');
      card.classList.add('in');
    } else {
      card.classList.add('filtered-out');
    }
  });

  triggerFades();
}

// ============================================================================
// 4. Email Copy & Toast Notification
// ============================================================================
function copyEmail() {
  const emailEl = document.getElementById('email-address');
  const email = emailEl ? emailEl.textContent.trim() : 'satyarthranjan1@outlook.com';

  const copyButtons = document.querySelectorAll('.copy-btn');
  const setBtnText = (text) => {
    copyButtons.forEach((b) => {
      const span = b.querySelector('span');
      if (span) span.textContent = text;
    });
  };

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(email)
      .then(() => {
        showToast(`Copied ${email} to clipboard`);
        setBtnText('Copied!');
        setTimeout(() => setBtnText('Copy'), 2000);
      })
      .catch(() => {
        fallbackCopy(email);
      });
  } else {
    fallbackCopy(email);
  }
}

function fallbackCopy(text) {
  const tempInput = document.createElement('input');
  tempInput.value = text;
  tempInput.style.position = 'fixed';
  tempInput.style.opacity = '0';
  document.body.appendChild(tempInput);
  tempInput.select();

  try {
    document.execCommand('copy');
    showToast(`Copied ${text} to clipboard`);
  } catch (_) {
    showToast(`Email: ${text}`);
  } finally {
    document.body.removeChild(tempInput);
  }
}

let toastTimer = null;
function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add('show');

  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove('show');
  }, 2600);
}

// ============================================================================
// 5. Scroll Fade Animations
// ============================================================================
function triggerFades() {
  const fades = document.querySelectorAll('.fade:not(.in)');
  if (!fades.length) return;

  if (!('IntersectionObserver' in window)) {
    fades.forEach((el) => el.classList.add('in'));
    return;
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.05,
    rootMargin: '0px 0px -20px 0px'
  });

  fades.forEach((el) => io.observe(el));
}

// ============================================================================
// 6. The Real Dark Mode (Spotlight Mode)
// Inspired by Pankaj Tanwar's "The Real Dark Mode"
// ============================================================================
let isTorchActive = false;
let torchBeamRadius = 260; // px
const MIN_BEAM = 140;
const MAX_BEAM = 460;

// Smooth physics lerp tracking for natural cinematic beam drag
let torchTargetX = window.innerWidth / 2;
let torchTargetY = window.innerHeight / 2;
let torchCurrentX = window.innerWidth / 2;
let torchCurrentY = window.innerHeight / 2;
let torchLerpRaf = null;
const TORCH_LERP = 0.16;

function animateTorch() {
  const dx = torchTargetX - torchCurrentX;
  const dy = torchTargetY - torchCurrentY;

  torchCurrentX += dx * TORCH_LERP;
  torchCurrentY += dy * TORCH_LERP;

  const rootStyle = document.documentElement.style;
  rootStyle.setProperty('--torch-x', `${torchCurrentX.toFixed(1)}px`);
  rootStyle.setProperty('--torch-y', `${torchCurrentY.toFixed(1)}px`);

  // Stop animation frame loop when cursor comes to a rest (saves CPU & battery)
  if (Math.abs(dx) > 0.2 || Math.abs(dy) > 0.2) {
    torchLerpRaf = requestAnimationFrame(animateTorch);
  } else {
    torchLerpRaf = null;
  }
}

function updateTorchPosition(x, y) {
  torchTargetX = x;
  torchTargetY = y;
  if (isTorchActive && !torchLerpRaf) {
    torchLerpRaf = requestAnimationFrame(animateTorch);
  }
}

function adjustBeamRadius(delta) {
  torchBeamRadius = Math.min(MAX_BEAM, Math.max(MIN_BEAM, torchBeamRadius + delta));
  document.documentElement.style.setProperty('--torch-beam', `${torchBeamRadius}px`);
  showToast(`🔦 Spotlight beam: ${torchBeamRadius}px`);
}

function toggleTorchMode(forceState) {
  const nextState = typeof forceState === 'boolean' ? forceState : !isTorchActive;
  isTorchActive = nextState;

  const html = document.documentElement;
  html.classList.toggle('real-dark-active', isTorchActive);

  const deskBtn = document.getElementById('torch-toggle-desktop');
  const mobBtn = document.getElementById('torch-toggle-mobile');
  if (deskBtn) deskBtn.classList.toggle('active', isTorchActive);
  if (mobBtn) mobBtn.classList.toggle('active', isTorchActive);

  if (isTorchActive) {
    document.documentElement.style.setProperty('--torch-beam', `${torchBeamRadius}px`);
    // Snap instantly to current target position so beam doesn't fly across screen on turn-on
    torchCurrentX = torchTargetX;
    torchCurrentY = torchTargetY;
    document.documentElement.style.setProperty('--torch-x', `${torchCurrentX.toFixed(1)}px`);
    document.documentElement.style.setProperty('--torch-y', `${torchCurrentY.toFixed(1)}px`);
    showToast('🔦 Spotlight active — move cursor to illuminate');
  } else {
    if (torchLerpRaf) {
      cancelAnimationFrame(torchLerpRaf);
      torchLerpRaf = null;
    }
    showToast('💡 Spotlight turned off');
  }
}

// Track mouse & touch positions with passive listeners
window.addEventListener('mousemove', (e) => {
  updateTorchPosition(e.clientX, e.clientY);
}, { passive: true });

window.addEventListener('touchstart', (e) => {
  if (e.touches && e.touches[0]) {
    updateTorchPosition(e.touches[0].clientX, e.touches[0].clientY);
  }
}, { passive: true });

window.addEventListener('touchmove', (e) => {
  if (e.touches && e.touches[0]) {
    updateTorchPosition(e.touches[0].clientX, e.touches[0].clientY);
  }
}, { passive: true });

// ============================================================================
// 7. Interactive 8-Directional Mascot Avatar
// Clean 1:1 rendering, 8-directional gaze tracking + center eye contact deadzone
// High-performance: cached bounding box eliminates forced layout reflows!
// ============================================================================
function initMascot() {
  const display = document.getElementById('mascotDisplay') || document.getElementById('mascotWrapper');
  const dirSprite = document.getElementById('mascotDirections');
  if (!display || !dirSprite) return;

  // 9 sprite poses from the 3x3 avatar sheet:
  // Row 0: up-left, up, up-right
  // Row 1: left, center, right
  // Row 2: down-left, down, down-right
  const DIR_NAMES = [
    'up-left', 'up', 'up-right',
    'left', 'center', 'right',
    'down-left', 'down', 'down-right'
  ];
  const RADIAL_DIRS = [
    'right', 'down-right', 'down', 'down-left',
    'left', 'up-left', 'up', 'up-right'
  ];
  const SECTOR_ANGLE = (Math.PI * 2) / 8; // 45 deg = ~0.785398 rad
  const DEADZONE = 22; // px: small inner circle for direct eye contact

  let currentDir = 'center';
  let lastSector = -1;

  // Cached bounding rect - updated on resize / scroll to avoid layout thrashing on every mousemove!
  let cachedCenterX = 0;
  let cachedCenterY = 0;

  function updateMascotCenter() {
    const rect = display.getBoundingClientRect();
    cachedCenterX = rect.left + rect.width / 2;
    cachedCenterY = rect.top + rect.height / 2;
  }

  updateMascotCenter();
  window.addEventListener('resize', updateMascotCenter, { passive: true });
  window.addEventListener('scroll', updateMascotCenter, { passive: true });

  function getSpritePos(index) {
    const col = index % 3;
    const row = Math.floor(index / 3);
    return `${col * 50}% ${row * 50}%`;
  }

  function setDirection(dirName) {
    if (dirName === currentDir) return;
    currentDir = dirName;
    const idx = DIR_NAMES.indexOf(dirName);
    if (idx !== -1) {
      dirSprite.style.backgroundPosition = getSpritePos(idx);
    }
  }

  function handlePointer(x, y) {
    const dx = x - cachedCenterX;
    const dy = y - cachedCenterY;
    const dist = Math.hypot(dx, dy);

    // If cursor is in deadzone near the face center, make direct eye contact
    if (dist < DEADZONE) {
      lastSector = -1;
      setDirection('center');
      return;
    }

    // Calculate angle in radians [0, 2π)
    const angle = Math.atan2(dy, dx);
    const normAngle = (angle + 2 * Math.PI) % (2 * Math.PI);

    // 8 equal sectors centered on right, down-right, down, etc.
    const sector = Math.floor(((normAngle + Math.PI / 8) % (2 * Math.PI)) / SECTOR_ANGLE);

    if (sector !== lastSector) {
      lastSector = sector;
      setDirection(RADIAL_DIRS[sector]);
    }
  }

  window.addEventListener('pointermove', (e) => {
    handlePointer(e.clientX, e.clientY);
  }, { passive: true });

  document.addEventListener('mouseleave', () => {
    lastSector = -1;
    setDirection('center');
  });
}

// ============================================================================
// 8. Keyboard Shortcuts
// ============================================================================
document.addEventListener('keydown', (e) => {
  // Ignore keystrokes when user is typing in form inputs
  const tag = (document.activeElement && document.activeElement.tagName) || '';
  if (['input', 'textarea', 'select'].includes(tag.toLowerCase())) {
    return;
  }

  // Ignore keystrokes with browser modifiers (Ctrl+F, Cmd+T, Alt+Tab, etc.)
  if (e.ctrlKey || e.metaKey || e.altKey) {
    return;
  }

  const key = e.key;

  if (key === '1') {
    showView('home');
  } else if (key === '2') {
    showView('projects');
  } else if (key === '3') {
    showView('posts');
  } else if (key === 't' || key === 'T') {
    toggleTheme();
  } else if (key === 'f' || key === 'F') {
    toggleTorchMode();
  } else if (key === 'Escape' && isTorchActive) {
    toggleTorchMode(false);
  } else if ((key === '[' || key === '{') && isTorchActive) {
    adjustBeamRadius(-40);
  } else if ((key === ']' || key === '}') && isTorchActive) {
    adjustBeamRadius(40);
  } else if (key === 'c' || key === 'C') {
    copyEmail();
  }
});

// ============================================================================
// 9. Lifecycle Initialization & Global Scope Handoff
// ============================================================================
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  triggerFades();
  initMascot();
});

// Bind functions to window so any existing inline HTML references remain 100% functional
window.showView = showView;
window.scrollToConnect = scrollToConnect;
window.filterProjects = filterProjects;
window.copyEmail = copyEmail;
window.showToast = showToast;
window.toggleTheme = toggleTheme;
window.toggleTorchMode = toggleTorchMode;
window.adjustBeamRadius = adjustBeamRadius;

