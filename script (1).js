/**
 * College Memories — script.js
 * =====================================================
 * Loads data.json and builds the entire page dynamically.
 * Features:
 *  - Dynamic rendering from JSON
 *  - Scroll-based reveal animations (IntersectionObserver)
 *  - Animated counters
 *  - Fullscreen modal with keyboard + swipe navigation
 *  - Lazy loading images + videos
 *  - Background music toggle
 *  - Mobile navigation
 *  - Particle effects on closing screen
 *  - Scroll to top button
 * =====================================================
 */

/* =====================================================
   GLOBALS
   ===================================================== */
let DATA = null;                // Full JSON data
let FLAT_MEMORIES = [];         // Flattened array for modal navigation
let CURRENT_MODAL_INDEX = null; // Index into FLAT_MEMORIES
let touchStartX = 0;            // For swipe detection
let isFirstPlay = true;         // Music autoplay guard

/* =====================================================
   INIT
   ===================================================== */
document.addEventListener('DOMContentLoaded', async () => {
  await loadData();
  buildNav();
  buildHero();
  buildTimeline();
  buildMessage();
  buildClosing();
  buildParticles();
  initScrollReveal();
  initAnimatedCounters();
  initModal();
  initMusicToggle();
  initScrollTop();
  initMobileNav();
  hideLoader();
});

/* =====================================================
   DATA LOADING
   ===================================================== */
async function loadData() {
  try {
    const response = await fetch('data.json');
    if (!response.ok) throw new Error('Network response was not ok');
    DATA = await response.json();

    // Build flat memory list for modal prev/next navigation
    DATA.years.forEach(year => {
      year.memories.forEach(memory => {
        FLAT_MEMORIES.push({ ...memory, yearLabel: year.label, yearColor: year.color });
      });
    });
  } catch (err) {
    console.error('Failed to load data.json:', err);
    // Show a graceful error banner
    document.body.innerHTML = `
      <div style="min-height:100vh;display:flex;align-items:center;justify-content:center;font-family:sans-serif;color:#e8e6f0;background:#0a0a0f;text-align:center;padding:40px;">
        <div>
          <p style="font-size:3rem;margin-bottom:16px;">⚠️</p>
          <h2 style="margin-bottom:12px;">Could not load memories</h2>
          <p style="color:#7a7890;">Make sure <code>data.json</code> is in the same folder as <code>index.html</code>.<br/>
          If running locally, use a local server (e.g. <code>npx serve .</code>).</p>
        </div>
      </div>`;
  }
}

/* =====================================================
   LOADER
   ===================================================== */
function hideLoader() {
  const loader = document.getElementById('loader');
  // Small delay so the page renders first
  setTimeout(() => loader.classList.add('hidden'), 600);
}

/* =====================================================
   NAVIGATION — build year links dynamically
   ===================================================== */
function buildNav() {
  if (!DATA) return;
  const list = document.getElementById('nav-years');
  DATA.years.forEach(year => {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = `#${year.id}`;
    a.textContent = year.label;
    a.dataset.yearId = year.id;
    li.appendChild(a);
    list.appendChild(li);
  });

  // Highlight active nav link on scroll
  const sections = DATA.years.map(y => document.getElementById(y.id)).filter(Boolean);
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        list.querySelectorAll('a').forEach(a => {
          a.classList.toggle('active', a.dataset.yearId === entry.target.id);
        });
      }
    });
  }, { rootMargin: '-40% 0px -50% 0px' });

  // Observe sections once built (slight delay)
  setTimeout(() => sections.forEach(s => observer.observe(s)), 200);
}

/* =====================================================
   HERO — inject meta data
   ===================================================== */
function buildHero() {
  if (!DATA) return;
  const { meta } = DATA;

  document.title = meta.title;
  safeSet('hero-batch', `${meta.batch} · ${meta.branch}`);
  safeSet('hero-sub', meta.college);
  safeSet('closing-batch', `${meta.batch} — ${meta.branch}, ${meta.college}`);

  // Update counter targets dynamically
  const totalMemories = DATA.years.reduce((sum, y) => sum + y.memories.length, 0);
  const counters = document.querySelectorAll('.counter-num');
  if (counters[1]) counters[1].dataset.target = totalMemories;
}

/* =====================================================
   TIMELINE — build all year sections
   ===================================================== */
function buildTimeline() {
  if (!DATA) return;
  const timeline = document.getElementById('timeline');

  DATA.years.forEach((year, yearIdx) => {
    const section = document.createElement('section');
    section.id = year.id;
    section.className = 'year-section scroll-reveal';
    section.style.setProperty('--year-color', year.color);

    // Year header
    section.appendChild(buildYearHeader(year));

    // Memory grid
    const grid = document.createElement('div');
    grid.className = 'memory-grid stagger-children';

    year.memories.forEach((memory, memIdx) => {
      // Find global index in FLAT_MEMORIES for modal
      const globalIdx = FLAT_MEMORIES.findIndex(m => m.id === memory.id);
      const card = buildMemoryCard(memory, globalIdx, year.color);
      grid.appendChild(card);
    });

    section.appendChild(grid);
    timeline.appendChild(section);
  });
}

/* Build the year header block */
function buildYearHeader(year) {
  const header = document.createElement('div');
  header.className = 'year-header';

  // Badge
  const badge = document.createElement('div');
  badge.className = 'year-badge scroll-reveal-left';
  badge.innerHTML = `
    <span class="year-badge-emoji">${year.emoji}</span>
    <span class="year-badge-num">${year.period.split('–')[0].trim()}</span>
  `;

  // Meta block
  const meta = document.createElement('div');
  meta.className = 'year-meta';
  meta.innerHTML = `
    <p class="year-period">${year.period}</p>
    <h2 class="year-label">${year.label}</h2>
    <p class="year-theme">"${year.theme}"</p>
    <p class="year-desc">${year.description}</p>
  `;

  header.appendChild(badge);
  header.appendChild(meta);
  return header;
}

/* Build a single memory card (photo or video) */
function buildMemoryCard(memory, globalIdx, yearColor) {
  const card = document.createElement('article');
  card.className = `memory-card ${memory.type}`;
  card.setAttribute('role', 'button');
  card.setAttribute('tabindex', '0');
  card.setAttribute('aria-label', memory.caption);

  if (memory.type === 'image') {
    card.innerHTML = `
      <div class="card-media">
        <img
          class="card-img"
          src="${memory.src}"
          alt="${escapeHtml(memory.caption)}"
          loading="lazy"
          decoding="async"
        />
        <div class="card-overlay">
          <span class="card-overlay-icon">⤢</span>
        </div>
      </div>
      <div class="card-footer">
        <p class="card-caption">${escapeHtml(memory.caption)}</p>
        <div class="card-meta">
          <span class="card-date">📅 ${memory.date}</span>
          <div class="card-tags">
            ${(memory.tags || []).slice(0, 2).map(t => `<span class="card-tag">${t}</span>`).join('')}
          </div>
        </div>
      </div>`;

    // Click → open modal
    card.addEventListener('click', () => openModal(globalIdx));
    card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') openModal(globalIdx); });

  } else if (memory.type === 'video') {
    card.innerHTML = `
      <div class="card-media">
        <iframe
          src="${memory.src}?enablejsapi=1&mute=1"
          title="${escapeHtml(memory.caption)}"
          allowfullscreen
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        ></iframe>
        <span class="card-video-badge">▶ Video</span>
      </div>
      <div class="card-footer">
        <p class="card-caption">${escapeHtml(memory.caption)}</p>
        <div class="card-meta">
          <span class="card-date">📅 ${memory.date}</span>
          <div class="card-tags">
            ${(memory.tags || []).slice(0, 2).map(t => `<span class="card-tag">${t}</span>`).join('')}
          </div>
        </div>
      </div>`;

    // For video cards, click opens modal with iframe (with pointer-events)
    card.addEventListener('click', (e) => {
      // Allow iframe clicks to play in-card, open modal on card-footer click
      if (e.target.closest('.card-footer')) openModal(globalIdx);
    });
  }

  return card;
}

/* =====================================================
   MESSAGE SECTION
   ===================================================== */
function buildMessage() {
  if (!DATA) return;
  const { message } = DATA.meta;
  safeSet('message-heading', message.heading);
  safeSet('message-body', message.body);
  safeSet('message-author', `— ${message.author}`);
}

/* =====================================================
   CLOSING SECTION
   ===================================================== */
function buildClosing() {
  if (!DATA) return;
  const el = document.getElementById('closing-batch');
  if (el) el.textContent = `${DATA.meta.batch} · ${DATA.meta.branch}`;
}

/* =====================================================
   PARTICLES (decorative background)
   ===================================================== */
function buildParticles() {
  const container = document.getElementById('particles');
  if (!container) return;

  const colors = ['#c9b4f7', '#f7b4c9', '#fbbf24', '#4ade80', '#60a5fa'];
  const count = 28;

  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.style.cssText = `
      left: ${Math.random() * 100}%;
      --dur: ${6 + Math.random() * 10}s;
      --delay: ${Math.random() * 8}s;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      width: ${2 + Math.random() * 4}px;
      height: ${2 + Math.random() * 4}px;
      opacity: 0;
    `;
    container.appendChild(p);
  }
}

/* =====================================================
   SCROLL REVEAL — IntersectionObserver
   ===================================================== */
function initScrollReveal() {
  const options = { threshold: 0.12, rootMargin: '0px 0px -60px 0px' };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Unobserve after reveal for performance
        if (!entry.target.classList.contains('stagger-children')) {
          observer.unobserve(entry.target);
        }
      }
    });
  }, options);

  // Observe all reveal elements (including dynamically created ones)
  function observeAll() {
    document.querySelectorAll(
      '.scroll-reveal, .scroll-reveal-left, .stagger-children'
    ).forEach(el => observer.observe(el));
  }

  // Initial pass
  observeAll();

  // Re-observe after timeline builds (small delay for dynamic content)
  setTimeout(observeAll, 100);
}

/* =====================================================
   ANIMATED COUNTERS
   ===================================================== */
function initAnimatedCounters() {
  const counters = document.querySelectorAll('.counter-num');
  const duration = 2000; // ms

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.target, 10);
      const start = performance.now();

      function tick(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(eased * target);
        if (progress < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
}

/* =====================================================
   MODAL — Fullscreen Memory Viewer
   ===================================================== */
function initModal() {
  const modal = document.getElementById('modal');
  const closeBtn = document.getElementById('modal-close');
  const prevBtn = document.getElementById('modal-prev');
  const nextBtn = document.getElementById('modal-next');
  const backdrop = document.getElementById('modal-backdrop');

  closeBtn.addEventListener('click', closeModal);
  backdrop.addEventListener('click', closeModal);
  prevBtn.addEventListener('click', () => navigateModal(-1));
  nextBtn.addEventListener('click', () => navigateModal(1));

  // Keyboard navigation
  document.addEventListener('keydown', e => {
    if (modal.hidden) return;
    if (e.key === 'Escape') closeModal();
    if (e.key === 'ArrowLeft') navigateModal(-1);
    if (e.key === 'ArrowRight') navigateModal(1);
  });

  // Touch / swipe support
  modal.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  modal.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].screenX - touchStartX;
    if (Math.abs(dx) > 50) navigateModal(dx < 0 ? 1 : -1);
  }, { passive: true });
}

function openModal(index) {
  if (index < 0 || index >= FLAT_MEMORIES.length) return;
  CURRENT_MODAL_INDEX = index;
  renderModal();

  const modal = document.getElementById('modal');
  modal.hidden = false;
  document.body.style.overflow = 'hidden';

  // Focus the modal for accessibility
  document.getElementById('modal-close').focus();
}

function closeModal() {
  const modal = document.getElementById('modal');
  modal.hidden = true;
  document.body.style.overflow = '';
  CURRENT_MODAL_INDEX = null;
}

function navigateModal(direction) {
  if (CURRENT_MODAL_INDEX === null) return;
  const next = CURRENT_MODAL_INDEX + direction;
  if (next < 0 || next >= FLAT_MEMORIES.length) return;
  CURRENT_MODAL_INDEX = next;
  renderModal();
}

function renderModal() {
  const memory = FLAT_MEMORIES[CURRENT_MODAL_INDEX];
  const mediaEl = document.getElementById('modal-media');
  const captionEl = document.getElementById('modal-caption');
  const dateEl = document.getElementById('modal-date');
  const prevBtn = document.getElementById('modal-prev');
  const nextBtn = document.getElementById('modal-next');

  // Clear previous media
  mediaEl.innerHTML = '';

  if (memory.type === 'image') {
    const img = document.createElement('img');
    img.src = memory.src;
    img.alt = memory.caption;
    mediaEl.appendChild(img);
  } else if (memory.type === 'video') {
    const iframe = document.createElement('iframe');
    iframe.src = memory.src + '?autoplay=0';
    iframe.title = memory.caption;
    iframe.allowFullscreen = true;
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
    iframe.style.border = 'none';
    mediaEl.appendChild(iframe);
  }

  captionEl.textContent = memory.caption;
  dateEl.textContent = `${memory.yearLabel} · ${memory.date}`;

  // Disable nav buttons at edges
  prevBtn.disabled = CURRENT_MODAL_INDEX === 0;
  nextBtn.disabled = CURRENT_MODAL_INDEX === FLAT_MEMORIES.length - 1;
  prevBtn.style.opacity = prevBtn.disabled ? '0.3' : '1';
  nextBtn.style.opacity = nextBtn.disabled ? '0.3' : '1';
}

/* =====================================================
   BACKGROUND MUSIC TOGGLE
   ===================================================== */
function initMusicToggle() {
  const btn = document.getElementById('music-toggle');
  const audio = document.getElementById('bg-music');
  const iconOn = btn.querySelector('.music-on');
  const iconOff = btn.querySelector('.music-off');

  let playing = false;

  btn.addEventListener('click', () => {
    if (playing) {
      audio.pause();
      playing = false;
      btn.classList.remove('playing');
      iconOn.hidden = false;
      iconOff.hidden = true;
    } else {
      // Volume fade in
      audio.volume = 0;
      audio.play().then(() => {
        playing = true;
        btn.classList.add('playing');
        iconOn.hidden = true;
        iconOff.hidden = false;
        fadeAudio(audio, 0, 0.3, 2000);
      }).catch(() => {
        // Autoplay blocked — ignore silently
      });
    }
  });
}

/* Smooth audio fade utility */
function fadeAudio(audio, from, to, duration) {
  const start = performance.now();
  function tick(now) {
    const t = Math.min((now - start) / duration, 1);
    audio.volume = from + (to - from) * t;
    if (t < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

/* =====================================================
   SCROLL TO TOP BUTTON
   ===================================================== */
function initScrollTop() {
  const btn = document.getElementById('scroll-top');

  window.addEventListener('scroll', () => {
    btn.hidden = window.scrollY < 400;
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* =====================================================
   MOBILE NAVIGATION
   ===================================================== */
function initMobileNav() {
  const hamburger = document.getElementById('nav-hamburger');
  const navYears = document.getElementById('nav-years');

  hamburger.addEventListener('click', () => {
    const isOpen = navYears.classList.toggle('mobile-open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen.toString());
  });

  // Close menu when a link is clicked
  navYears.addEventListener('click', e => {
    if (e.target.tagName === 'A') {
      navYears.classList.remove('mobile-open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    }
  });

  // Close on outside click
  document.addEventListener('click', e => {
    if (!e.target.closest('#navbar')) {
      navYears.classList.remove('mobile-open');
      hamburger.classList.remove('open');
    }
  });
}

/* =====================================================
   UTILITIES
   ===================================================== */

/** Safely set textContent on an element by ID */
function safeSet(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

/** Escape HTML special chars to prevent XSS */
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
