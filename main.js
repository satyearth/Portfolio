function showView(view) {
  const views = ['home', 'projects', 'posts'];
  views.forEach((v) => {
    const el = document.getElementById(`view-${v}`);
    if (el) {
      el.classList.toggle('active', v === view);
    }
  });

  const deskHome = document.getElementById('nav-home');
  const deskProjects = document.getElementById('nav-projects');
  const deskPosts = document.getElementById('nav-posts');

  if (deskHome) deskHome.classList.toggle('active', view === 'home');
  if (deskProjects) deskProjects.classList.toggle('active', view === 'projects');
  if (deskPosts) deskPosts.classList.toggle('active', view === 'posts');

  const mobHome = document.getElementById('mob-nav-home');
  const mobProjects = document.getElementById('mob-nav-projects');
  const mobPosts = document.getElementById('mob-nav-posts');
  const mobConnect = document.getElementById('mob-nav-connect');

  if (mobHome) mobHome.classList.toggle('active', view === 'home');
  if (mobProjects) mobProjects.classList.toggle('active', view === 'projects');
  if (mobPosts) mobPosts.classList.toggle('active', view === 'posts');
  if (mobConnect) mobConnect.classList.remove('active');

  window.scrollTo({ top: 0, behavior: 'smooth' });
  setTimeout(triggerFades, 60);
}

function scrollToConnect() {
  const homeView = document.getElementById('view-home');
  const currentViewActive = homeView ? homeView.classList.contains('active') : false;
  if (!currentViewActive) {
    showView('home');
    setTimeout(() => {
      performScrollToConnect();
    }, 150);
  } else {
    performScrollToConnect();
  }

  const mobTabs = document.querySelectorAll('.mob-tab');
  mobTabs.forEach((tab) => tab.classList.remove('active'));
  const mobConnect = document.getElementById('mob-nav-connect');
  if (mobConnect) mobConnect.classList.add('active');
}

function performScrollToConnect() {
  const connectSec = document.getElementById('connect-section');
  if (connectSec) {
    connectSec.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}

function filterProjects(filterTag, btn) {
  const buttons = document.querySelectorAll('.filter-btn');
  buttons.forEach((b) => { b.classList.remove('active'); b.setAttribute('aria-pressed', 'false'); });
  if (btn) { btn.classList.add('active'); btn.setAttribute('aria-pressed', 'true'); }

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

  setTimeout(triggerFades, 50);
}

function copyEmail() {
  const emailEl = document.getElementById('email-address');
  const email = emailEl ? emailEl.textContent.trim() : 'satyarthranjan1@outlook.com';
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(email).then(() => {
      showToast(`Copied ${email} to clipboard`);
    }).catch(() => {
      fallbackCopy(email);
    });
  } else {
    fallbackCopy(email);
  }
}

function fallbackCopy(text) {
  const tempInput = document.createElement('input');
  tempInput.value = text;
  document.body.appendChild(tempInput);
  tempInput.select();
  try {
    document.execCommand('copy');
    showToast(`Copied ${text} to clipboard`);
  } catch (err) {
    showToast(`Email: ${text}`);
  }
  document.body.removeChild(tempInput);
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

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
}

function initTheme() {
  const savedTheme = sessionStorage.getItem('theme');
  if (savedTheme) {
    applyTheme(savedTheme);
  } else {
    applyTheme('dark');
  }
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme') || 'light';
  const target = current === 'dark' ? 'light' : 'dark';
  applyTheme(target);
  try {
    sessionStorage.setItem('theme', target);
  } catch (_) {}
  showToast(`Switched to ${target} mode`);
}

function triggerFades() {
  const fades = document.querySelectorAll('.fade:not(.in)');

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
// The Real Dark Mode (Flashlight / Spotlight Mode)
// Inspired by Pankaj Tanwar's "The Real Dark Mode"
// ============================================================================
let isTorchActive = false;
let torchBeamRadius = 260; // px
const MIN_BEAM = 140;
const MAX_BEAM = 460;

// Smooth lerp tracking — gives a natural cinematic lag to the torch
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

  document.documentElement.style.setProperty('--torch-x', `${torchCurrentX}px`);
  document.documentElement.style.setProperty('--torch-y', `${torchCurrentY}px`);

  if (Math.abs(dx) > 0.4 || Math.abs(dy) > 0.4) {
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
    // Snap current position instantly on activate so there's no swoosh from center
    torchCurrentX = torchTargetX;
    torchCurrentY = torchTargetY;
    document.documentElement.style.setProperty('--torch-x', `${torchCurrentX}px`);
    document.documentElement.style.setProperty('--torch-y', `${torchCurrentY}px`);
    showToast('🔦 Spotlight active — move cursor to illuminate');
  } else {
    if (torchLerpRaf) { cancelAnimationFrame(torchLerpRaf); torchLerpRaf = null; }
    showToast('💡 Spotlight turned off');
  }
}

// Track mouse and touch pointers
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

document.addEventListener('keydown', (e) => {
  if (['input', 'textarea'].includes(document.activeElement.tagName.toLowerCase())) {
    return;
  }
  // Don't intercept browser shortcuts (Ctrl+F, Cmd+T, etc.)
  if (e.ctrlKey || e.metaKey || e.altKey) {
    return;
  }

  if (e.key === '1') {
    showView('home');
  } else if (e.key === '2') {
    showView('projects');
  } else if (e.key === '3') {
    showView('posts');
  } else if (e.key === 't' || e.key === 'T') {
    toggleTheme();
  } else if (e.key === 'f' || e.key === 'F') {
    toggleTorchMode();
  } else if (e.key === 'Escape' && isTorchActive) {
    toggleTorchMode(false);
  } else if ((e.key === '[' || e.key === '{') && isTorchActive) {
    adjustBeamRadius(-40);
  } else if ((e.key === ']' || e.key === '}') && isTorchActive) {
    adjustBeamRadius(40);
  } else if (e.key === 'c' || e.key === 'C') {
    copyEmail();
  }
});

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  triggerFades();
  initMascot();
});

// ============================================================================
// Interactive Avatar (Direction-Tracking Mascot)
// Clean, razor-sharp 1:1 rendering, 8-directional tracking + center pose
// ============================================================================
function initMascot() {
  const display = document.getElementById('mascotDisplay') || document.getElementById('mascotWrapper');
  const dirSprite = document.getElementById('mascotDirections');
  if (!display || !dirSprite) return;

  // 9 sprite poses from the 3x3 avatar sheet
  // Row 0: up-left, up, up-right
  // Row 1: left, center, right
  // Row 2: down-left, down, down-right
  const DIR_NAMES = ['up-left', 'up', 'up-right', 'left', 'center', 'right', 'down-left', 'down', 'down-right'];
  const RADIAL_DIRS = ['right', 'down-right', 'down', 'down-left', 'left', 'up-left', 'up', 'up-right'];
  const SECTOR_ANGLE = (Math.PI * 2) / 8; // 45 deg = 0.785398 rad
  const DEADZONE = 20; // px: small inner deadzone for direct eye contact

  let currentDir = 'center';
  let lastSector = -1;

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
    const rect = display.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const dx = x - centerX;
    const dy = y - centerY;
    const dist = Math.hypot(dx, dy);

    // If cursor is right on center pupil, look straight ahead
    if (dist < DEADZONE) {
      lastSector = -1;
      setDirection('center');
      return;
    }

    // 8-directional radial angle
    const angle = Math.atan2(dy, dx);
    const normAngle = (angle + 2 * Math.PI) % (2 * Math.PI);
    // 8 equal sectors of 45 deg centered on each direction:
    // right (337.5 to 22.5), down-right (22.5 to 67.5), etc.
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

