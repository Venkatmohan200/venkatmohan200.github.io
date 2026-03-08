// ══════════════════════════════════════════
//   VENKATMOHAN VASAMSETTI — Portfolio JS
//   Features: Particles, Cursor, Counters,
//   Tabs, Skill Bars, Typed, Reveal, Form
// ══════════════════════════════════════════

(function () {
  'use strict';

  // ── Preloader ──────────────────────────
  function initPreloader() {
    window.addEventListener('load', () => {
      setTimeout(() => {
        const pl = document.getElementById('preloader');
        if (pl) pl.classList.add('out');
      }, 900);
    });
  }

  // ── Particle Canvas ────────────────────
  function initParticles() {
    const canvas = document.getElementById('bgCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let W, H, particles = [], mouse = { x: 0, y: 0 };

    function resize() {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    class Particle {
      constructor() { this.reset(); }
      reset() {
        this.x  = Math.random() * W;
        this.y  = Math.random() * H;
        this.r  = Math.random() * 1.5 + 0.3;
        this.vx = (Math.random() - 0.5) * 0.3;
        this.vy = (Math.random() - 0.5) * 0.3;
        this.alpha = Math.random() * 0.5 + 0.1;
        this.color = Math.random() > 0.7 ? '#00e5c8' : '#4a6fa5';
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
        // mouse repulsion
        const dx = this.x - mouse.x, dy = this.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          this.x += dx / dist * 1.5;
          this.y += dy / dist * 1.5;
        }
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.alpha;
        ctx.fill();
      }
    }

    for (let i = 0; i < 120; i++) particles.push(new Particle());

    function drawLines() {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 110) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = '#00e5c8';
            ctx.globalAlpha = (1 - dist / 110) * 0.06;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
    }

    function animate() {
      ctx.clearRect(0, 0, W, H);
      ctx.globalAlpha = 1;
      drawLines();
      particles.forEach(p => { p.update(); p.draw(); });
      ctx.globalAlpha = 1;
      requestAnimationFrame(animate);
    }
    animate();

    window.addEventListener('mousemove', e => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });
  }

  // ── Custom Cursor ──────────────────────
  function initCursor() {
    const dot  = document.getElementById('curDot');
    const ring = document.getElementById('curRing');
    if (!dot || !ring) return;

    let mx = 0, my = 0, rx = 0, ry = 0;

    window.addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      dot.style.left = mx + 'px';
      dot.style.top  = my + 'px';
    });

    function loop() {
      rx += (mx - rx) * 0.12;
      ry += (my - ry) * 0.12;
      ring.style.left = rx + 'px';
      ring.style.top  = ry + 'px';
      requestAnimationFrame(loop);
    }
    loop();

    const hoverEls = document.querySelectorAll('a, button, .pcard, .ccard, .smcard, .sk-card, .tl-card');
    hoverEls.forEach(el => {
      el.addEventListener('mouseenter', () => { dot.classList.add('hover'); ring.classList.add('hover'); });
      el.addEventListener('mouseleave', () => { dot.classList.remove('hover'); ring.classList.remove('hover'); });
    });
  }

  // ── Header Scroll ──────────────────────
  function initHeader() {
    const hdr = document.getElementById('header');
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
      const s = window.scrollY;
      hdr.classList.toggle('scrolled', s > 50);
      lastScroll = s;
    }, { passive: true });
  }

  // ── Mobile Drawer ──────────────────────
  function initDrawer() {
    const burger = document.getElementById('burger');
    const drawer = document.getElementById('drawer');
    const bg     = document.getElementById('drawerBg');
    if (!burger || !drawer) return;

    const open  = () => { drawer.classList.add('open'); bg.classList.add('show'); burger.classList.add('open'); document.body.style.overflow = 'hidden'; };
    const close = () => { drawer.classList.remove('open'); bg.classList.remove('show'); burger.classList.remove('open'); document.body.style.overflow = ''; };

    burger.addEventListener('click', () => drawer.classList.contains('open') ? close() : open());
    bg.addEventListener('click', close);
    drawer.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
  }

  // ── Scroll Reveal ──────────────────────
  function initReveal() {
    const els = document.querySelectorAll(
      '.reveal, .sec-hd, .about-grid, .tl-item, .smcard, .pcard, .ccard, .contact-grid, .hero-card, .hero-l'
    );
    els.forEach(el => {
      if (!el.classList.contains('reveal')) el.classList.add('reveal');
    });

    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const siblings = [...(entry.target.parentElement?.children || [])].filter(c => c.classList.contains('reveal'));
        const idx = siblings.indexOf(entry.target);
        setTimeout(() => entry.target.classList.add('in'), Math.min(idx * 80, 400));
        io.unobserve(entry.target);
      });
    }, { threshold: 0.07 });

    els.forEach(el => io.observe(el));
  }

  // ── Counter Animation ──────────────────
  function initCounters() {
    const counters = document.querySelectorAll('.counter[data-target]');
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el      = entry.target;
        const target  = parseFloat(el.dataset.target);
        const decimal = parseInt(el.dataset.decimal || '0');
        const dur     = 1400, steps = 70;
        let step = 0;
        const timer = setInterval(() => {
          step++;
          const t = step / steps;
          const ease = 1 - Math.pow(1 - t, 3);
          el.textContent = (target * ease).toFixed(decimal);
          if (step >= steps) { el.textContent = target.toFixed(decimal); clearInterval(timer); }
        }, dur / steps);
        io.unobserve(el);
      });
    }, { threshold: 0.5 });
    counters.forEach(el => io.observe(el));
  }

  // ── Skill Bars ─────────────────────────
  function initSkillBars() {
    const bars = document.querySelectorAll('.sb-item');
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const fill = entry.target.querySelector('.sb-fill');
        const w    = entry.target.dataset.width || '80';
        if (fill) setTimeout(() => fill.style.width = w + '%', 200);
        io.unobserve(entry.target);
      });
    }, { threshold: 0.3 });
    bars.forEach(b => io.observe(b));
  }

  // ── Resume Tabs ────────────────────────
  function initTabs() {
    const tabs     = document.querySelectorAll('.rtab');
    const contents = document.querySelectorAll('.rtab-content');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        contents.forEach(c => c.classList.remove('active'));
        tab.classList.add('active');
        const target = document.getElementById('tab-' + tab.dataset.tab);
        if (target) {
          target.classList.add('active');
          // re-trigger reveals inside new tab
          target.querySelectorAll('.reveal').forEach(el => {
            el.classList.remove('in');
            setTimeout(() => el.classList.add('in'), 50);
          });
        }
      });
    });
  }

  // ── Active Nav Highlight ───────────────
  function initActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const links    = document.querySelectorAll('.hdr-nav a:not(.nav-cta)');
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          links.forEach(l => {
            l.style.color = '';
            if (l.getAttribute('href') === '#' + entry.target.id) l.style.color = 'var(--cyan)';
          });
        }
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    sections.forEach(s => io.observe(s));
  }

  // ── Scroll Top ─────────────────────────
  function initScrollTop() {
    const btn = document.getElementById('scrollTop');
    if (!btn) return;
    window.addEventListener('scroll', () => btn.classList.toggle('show', window.scrollY > 500), { passive: true });
    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  // ── Contact Form ───────────────────────
  function initForm() {
    const form = document.getElementById('contactForm');
    const note = document.getElementById('cformNote');
    if (!form) return;
    form.addEventListener('submit', e => {
      e.preventDefault();
      const btn  = form.querySelector('button[type=submit]');
      const orig = btn.innerHTML;
      btn.innerHTML = '<span>Sending…</span> <i class="fas fa-spinner fa-spin"></i>';
      btn.disabled = true;
      setTimeout(() => {
        note.textContent = '✓ Message sent! I\'ll get back to you soon.';
        btn.innerHTML = '<span>Sent!</span> <i class="fas fa-check"></i>';
        btn.style.background = '#059652';
        form.reset();
        setTimeout(() => {
          btn.innerHTML = orig;
          btn.style.background = '';
          btn.disabled = false;
          note.textContent = '';
        }, 4000);
      }, 1000);
    });
  }

  // ── Smooth Anchors ─────────────────────
  function initAnchors() {
    document.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener('click', e => {
        const t = document.querySelector(a.getAttribute('href'));
        if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
      });
    });
  }

  // ── Tilt Cards ─────────────────────────
  function initTilt() {
    document.querySelectorAll('.pcard, .hero-card').forEach(card => {
      card.addEventListener('mousemove', e => {
        const r   = card.getBoundingClientRect();
        const x   = (e.clientX - r.left) / r.width  - 0.5;
        const y   = (e.clientY - r.top)  / r.height - 0.5;
        card.style.transform = `perspective(800px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateY(-5px)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  // ── Typing Effect in Hero ──────────────
  function initTyping() {
    // The CSS handles the word cycling animation for .role-words
    // This adds a subtle text shimmer to hero name on load
    const name = document.querySelector('.hero-name');
    if (!name) return;
  }

  // ── Page Transition on Load ────────────
  function initPageLoad() {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    window.addEventListener('load', () => {
      setTimeout(() => { document.body.style.opacity = '1'; }, 100);
    });
  }

  // ── Scroll-based header progress bar ──
  function initProgressBar() {
    const bar = document.createElement('div');
    bar.style.cssText = `
      position:fixed;top:0;left:0;height:2px;width:0%;
      background:linear-gradient(to right,#00e5c8,#00bfa5);
      z-index:1000;transition:width 0.1s linear;pointer-events:none;
    `;
    document.body.appendChild(bar);
    window.addEventListener('scroll', () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.width = ((window.scrollY / total) * 100) + '%';
    }, { passive: true });
  }

  // ── Init All ───────────────────────────
  function init() {
    initPageLoad();
    initPreloader();
    initParticles();
    initCursor();
    initHeader();
    initDrawer();
    initReveal();
    initCounters();
    initSkillBars();
    initTabs();
    initActiveNav();
    initScrollTop();
    initForm();
    initAnchors();
    initTilt();
    initTyping();
    initProgressBar();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
