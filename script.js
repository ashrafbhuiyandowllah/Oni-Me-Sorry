/* =========================================================
   LOVE WEBSITE — script.js
   All interactive logic for the romantic apology & date site
   ========================================================= */

/* ---------------------------------------------------------
   CONFIG — Edit these values easily
   --------------------------------------------------------- */
const CONFIG = {
  // Photos in assets/photos/ — add/remove as needed
  photos: [
    'assets/photos/photo1.jpg',
    'assets/photos/photo2.jpg',
    'assets/photos/photo3.jpg',
    'assets/photos/photo4.jpg',
    'assets/photos/photo5.jpg',
  ],

  // How much the YES button grows per NO click (em added to font-size)
  yesGrowthPerClick: 0.28,
  // Starting font size of yes button (rem)
  yesFontSizeStart: 1.05,
  // Max font size of yes button (rem)
  yesFontSizeMax: 2.8,
  // Max padding of yes button
  yesPaddingMax: 28,

  // How fast the NO button shrinks (fraction subtracted per click)
  noShrinkFactor: 0.80,
  // Minimum scale of NO button before it disappears
  noMinScale: 0.05,

  // Floating hearts interval (ms)
  heartSpawnInterval: 900,
  // Sparkle interval (ms)
  sparkleSpawnInterval: 700,

  // Toast auto-hide duration (ms)
  toastDuration: 3800,

  // Playful "No" messages shown in sequence
  noMessages: [
    "Nope 😭",
    "Are you sure? 🥺",
    "Pleaseee 🥺❤️",
    "Think again 😭",
    "Really?! 😭",
    "Come on… 🥺",
    "Please? I miss you ❤️",
    "Last chance! 🥺💕",
    "You know you want to 😭",
    "I'll be sad forever 😭💔",
  ],

  // Steak extra messages shown randomly
  steakMessages: [
    "Steak?! 😭",
    "Budget কোথায়? 😭",
    "Fuchka is calling you ❤️",
    "Maybe next month! 😭",
    "Your wallet is crying 😭",
  ],

  // Growth per steak click: how much fuchka card grows (px added to width)
  fuchkaGrowthPerClick: 28,
  fuchkaWidthStart: 160,
  fuchkaWidthMax: 340,
};

/* ---------------------------------------------------------
   STATE
   --------------------------------------------------------- */
let noClickCount   = 0;   // Times "No" was clicked on apology page
let steakClickCount = 0;  // Times steak was clicked on date-choice page
let musicPlaying   = false;
let currentPage    = 'page-apology';

/* ---------------------------------------------------------
   DOM ELEMENTS
   --------------------------------------------------------- */
const btnForgiven   = document.getElementById('btn-forgiven');
const btnNo         = document.getElementById('btn-no');
const noMsg         = document.getElementById('no-message');
const musicToggle   = document.getElementById('music-toggle');
const bgMusic       = document.getElementById('bg-music');
const toastEl       = document.getElementById('bengali-toast');
const toastMainMsg  = document.getElementById('toast-main-msg');
const toastSubMsg   = document.getElementById('toast-sub-msg');
const steakNote     = document.getElementById('steak-note');
const cardSteak     = document.getElementById('card-steak');
const cardFuchka    = document.getElementById('card-fuchka');
const confettiLayer = document.getElementById('confetti-layer');
const transOverlay  = document.getElementById('transition-overlay');

/* ---------------------------------------------------------
   INIT
   --------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  startFloatingHearts();
  startSparkles();
  setupMusicToggle();
  // Assign photos to backgrounds
  assignBackgroundPhotos();
});

/* ---------------------------------------------------------
   BACKGROUND PHOTO ASSIGNMENT
   Use photos sequentially for each page background
   --------------------------------------------------------- */
function assignBackgroundPhotos() {
  const p = CONFIG.photos;
  const get = (i) => p[i % p.length];

  const bgMap = {
    'bg-apology':       get(0),
    'bg-date-question': get(1),
    'bg-date-choice':   get(2),
    'bg-final':         get(3),
  };

  for (const [id, url] of Object.entries(bgMap)) {
    const el = document.getElementById(id);
    if (el) el.style.backgroundImage = `url('${url}')`;
  }
}

/* ---------------------------------------------------------
   PAGE TRANSITIONS
   --------------------------------------------------------- */
function transitionToPage(targetId, delay = 0) {
  // Show overlay
  transOverlay.classList.add('active');

  setTimeout(() => {
    // Hide current page
    const currentEl = document.querySelector('.page.active');
    if (currentEl) currentEl.classList.remove('active');

    // Show target page
    const targetEl = document.getElementById(targetId);
    if (targetEl) targetEl.classList.add('active');
    currentPage = targetId;

    // Hide overlay after brief moment
    setTimeout(() => {
      transOverlay.classList.remove('active');
    }, 500);

  }, delay > 0 ? delay : 600);
}

/* ---------------------------------------------------------
   PAGE 1 — APOLOGY LOGIC
   --------------------------------------------------------- */

// "Ok you are forgiven" clicked
function handleForgiven() {
  // Add a tiny celebration burst before transitioning
  spawnBurstHearts(document.getElementById('btn-forgiven'), 8);
  setTimeout(() => transitionToPage('page-date-question'), 600);
}

// "No" clicked
function handleNo() {
  noClickCount++;

  // Show playful message
  const msg = CONFIG.noMessages[Math.min(noClickCount - 1, CONFIG.noMessages.length - 1)];
  noMsg.textContent = msg;
  // Animate message refresh
  noMsg.style.animation = 'none';
  noMsg.offsetHeight; // reflow
  noMsg.style.animation = 'fadeInUp 0.4s ease';

  // Grow YES button
  const newFontSize = Math.min(
    CONFIG.yesFontSizeStart + noClickCount * CONFIG.yesGrowthPerClick,
    CONFIG.yesFontSizeMax
  );
  const newPadding = Math.min(14 + noClickCount * 3, CONFIG.yesPaddingMax);
  btnForgiven.style.fontSize   = newFontSize + 'rem';
  btnForgiven.style.padding    = `${newPadding}px ${newPadding * 2.2}px`;
  btnForgiven.style.borderRadius = '60px';

  // Shrink NO button
  const noScale = Math.max(Math.pow(CONFIG.noShrinkFactor, noClickCount), CONFIG.noMinScale);
  btnNo.style.transform = `scale(${noScale})`;
  btnNo.style.opacity   = Math.max(noScale, 0.08).toString();

  // After many clicks, hide No button entirely
  if (noClickCount >= 10) {
    btnNo.style.pointerEvents = 'none';
    btnNo.style.display = 'none';
  }

  // Wobble the heart for fun
  const heart = document.getElementById('main-heart');
  heart.style.animation = 'none';
  heart.offsetHeight;
  heart.style.animation = 'heartbeat 0.4s ease-in-out 3, heartbeat 1.4s ease-in-out 1.2s infinite';

  // Spawn a few floating hearts from the button
  spawnBurstHearts(btnNo, 4);
}

/* ---------------------------------------------------------
   PAGE 2 — DATE QUESTION LOGIC
   --------------------------------------------------------- */
function handleDateYes() {
  spawnBurstHearts(document.querySelector('.date-buttons'), 10);
  setTimeout(() => transitionToPage('page-date-choice'), 700);
}

/* ---------------------------------------------------------
   PAGE 3 — DATE CHOICE LOGIC
   --------------------------------------------------------- */

// Steak clicked
function handleSteak() {
  steakClickCount++;

  // Grow the fuchka card
  const newWidth = Math.min(
    CONFIG.fuchkaWidthStart + steakClickCount * CONFIG.fuchkaGrowthPerClick,
    CONFIG.fuchkaWidthMax
  );
  cardFuchka.style.width = newWidth + 'px';
  cardFuchka.style.padding = `${28 + steakClickCount * 4}px ${24 + steakClickCount * 3}px`;

  // Grow fuchka emoji
  const fuchkaEmoji = cardFuchka.querySelector('.card-emoji');
  fuchkaEmoji.style.fontSize = Math.min(2.8 + steakClickCount * 0.35, 5.5) + 'rem';

  // Grow fuchka label
  const fuchkaLabel = cardFuchka.querySelector('.card-label');
  fuchkaLabel.style.fontSize = Math.min(1.15 + steakClickCount * 0.12, 2.2) + 'rem';

  // Shrink steak card
  const steakScale = Math.max(1 - steakClickCount * 0.08, 0.4);
  cardSteak.style.transform = `scale(${steakScale})`;
  cardSteak.style.opacity   = Math.max(1 - steakClickCount * 0.12, 0.2).toString();

  // Steak note
  const steakNotes = [
    "Hmm, are you sure? 😅",
    "Fuchka is waving at you 🌶️",
    "Steak is expensive… 😭",
    "Your heart wants Fuchka 💕",
    "Click Fuchka! Please! 🥺",
  ];
  steakNote.textContent = steakNotes[Math.min(steakClickCount - 1, steakNotes.length - 1)];

  // Show Bengali toast
  showToast();
}

// Show Bengali toast notification
let toastTimer = null;
function showToast() {
  // Pick a random extra sub-message
  const subs = CONFIG.steakMessages;
  toastSubMsg.textContent = subs[Math.floor(Math.random() * subs.length)];

  // Animate in
  toastEl.classList.remove('show');
  // Force reflow so re-animation triggers
  toastEl.offsetHeight;
  toastEl.classList.add('show');

  // Auto-hide
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toastEl.classList.remove('show');
  }, CONFIG.toastDuration);
}

// Fuchka clicked — GO TO FINAL!
function handleFuchka() {
  // Hide toast
  toastEl.classList.remove('show');
  spawnBurstHearts(cardFuchka, 16);
  setTimeout(() => {
    transitionToPage('page-final');
    setTimeout(launchFinalCelebration, 900);
  }, 500);
}

/* ---------------------------------------------------------
   PAGE 4 — FINAL CELEBRATION
   --------------------------------------------------------- */
function launchFinalCelebration() {
  spawnConfettiHearts(60);
  // Keep spawning waves
  setTimeout(() => spawnConfettiHearts(40), 1500);
  setTimeout(() => spawnConfettiHearts(30), 3000);
}

function spawnConfettiHearts(count) {
  const hearts  = ['❤️','💕','💖','💗','💘','💝','🩷','✨','💓'];
  const layer   = confettiLayer;

  for (let i = 0; i < count; i++) {
    const el = document.createElement('div');
    el.classList.add('confetti-heart');
    el.textContent = hearts[Math.floor(Math.random() * hearts.length)];

    const leftPct = Math.random() * 100;
    const dur     = 2.5 + Math.random() * 2.5;
    const delay   = Math.random() * 1.5;
    const rot     = (Math.random() - 0.5) * 120;

    el.style.setProperty('--dur',   dur + 's');
    el.style.setProperty('--delay', delay + 's');
    el.style.setProperty('--rot',   rot + 'deg');
    el.style.left   = leftPct + '%';
    el.style.top    = '-30px';
    el.style.animationDelay = delay + 's';

    layer.appendChild(el);

    // Clean up after animation
    setTimeout(() => el.remove(), (dur + delay + 0.5) * 1000);
  }
}

/* ---------------------------------------------------------
   FLOATING HEARTS (global ambient layer)
   --------------------------------------------------------- */
function startFloatingHearts() {
  const layer  = document.getElementById('floating-hearts-layer');
  const emojis = ['❤️','💕','🩷','💗','💖','✨','💓'];

  setInterval(() => {
    const el  = document.createElement('div');
    el.classList.add('float-heart');
    el.textContent = emojis[Math.floor(Math.random() * emojis.length)];

    const leftPct = Math.random() * 100;
    const dur     = 5 + Math.random() * 6;
    const drift   = (Math.random() - 0.5) * 80;
    const size    = 1 + Math.random() * 0.8;

    el.style.setProperty('--dur',   dur + 's');
    el.style.setProperty('--drift', drift + 'px');
    el.style.left     = leftPct + '%';
    el.style.fontSize = size + 'rem';

    layer.appendChild(el);
    setTimeout(() => el.remove(), dur * 1000 + 200);
  }, CONFIG.heartSpawnInterval);
}

/* ---------------------------------------------------------
   SPARKLES (global ambient layer)
   --------------------------------------------------------- */
function startSparkles() {
  const layer = document.getElementById('sparkles-layer');

  setInterval(() => {
    const el  = document.createElement('div');
    el.classList.add('sparkle');

    const leftPct = Math.random() * 100;
    const topPct  = Math.random() * 100;
    const dur     = 1.2 + Math.random() * 1.5;

    el.style.setProperty('--dur', dur + 's');
    el.style.left = leftPct + '%';
    el.style.top  = topPct + '%';

    layer.appendChild(el);
    setTimeout(() => el.remove(), dur * 1000 + 100);
  }, CONFIG.sparkleSpawnInterval);
}

/* ---------------------------------------------------------
   BURST HEARTS (from a specific element)
   --------------------------------------------------------- */
function spawnBurstHearts(el, count = 8) {
  if (!el) return;
  const rect   = el.getBoundingClientRect();
  const cx     = rect.left + rect.width  / 2;
  const cy     = rect.top  + rect.height / 2;
  const emojis = ['❤️','💕','💗','💖','🩷'];
  const layer  = document.getElementById('floating-hearts-layer');

  for (let i = 0; i < count; i++) {
    const h    = document.createElement('div');
    const ang  = (Math.random() * 360) * (Math.PI / 180);
    const dist = 60 + Math.random() * 80;
    const dx   = Math.cos(ang) * dist;
    const dy   = Math.sin(ang) * dist;
    const dur  = 0.8 + Math.random() * 0.6;

    h.style.cssText = `
      position: fixed;
      left: ${cx}px;
      top: ${cy}px;
      font-size: ${1 + Math.random() * 0.8}rem;
      pointer-events: none;
      z-index: 9998;
      animation: burstHeart ${dur}s ease-out forwards;
      --dx: ${dx}px;
      --dy: ${dy}px;
    `;
    h.textContent = emojis[Math.floor(Math.random() * emojis.length)];

    // Inject keyframe dynamically once
    if (!document.getElementById('burst-keyframe')) {
      const style = document.createElement('style');
      style.id = 'burst-keyframe';
      style.textContent = `
        @keyframes burstHeart {
          0%   { transform: translate(0,0) scale(1); opacity: 1; }
          100% { transform: translate(var(--dx),var(--dy)) scale(0.3); opacity: 0; }
        }
      `;
      document.head.appendChild(style);
    }

    document.body.appendChild(h);
    setTimeout(() => h.remove(), (dur + 0.1) * 1000);
  }
}

/* ---------------------------------------------------------
   MUSIC TOGGLE
   --------------------------------------------------------- */
function setupMusicToggle() {
  musicToggle.addEventListener('click', () => {
    if (musicPlaying) {
      bgMusic.pause();
      musicPlaying = false;
      musicToggle.textContent = '🔇';
      musicToggle.classList.add('muted');
    } else {
      bgMusic.play().then(() => {
        musicPlaying = true;
        musicToggle.textContent = '🎵';
        musicToggle.classList.remove('muted');
      }).catch(() => {
        // Autoplay blocked — silently fail
      });
    }
  });
}
