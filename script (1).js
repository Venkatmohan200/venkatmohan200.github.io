// ═══════════════════════════════════════
//   Portfolio JS — Clean & Professional
// ═══════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {

  // ── Preloader ──
  const pre = document.getElementById('preloader');
  window.addEventListener('load', () => {
    setTimeout(() => pre.classList.add('gone'), 600);
  });


  // ── Header Sticky ──
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    header.classList.toggle('stuck', window.scrollY > 50);
  }, { passive: true });


  // ── Mobile Nav ──
  const ham      = document.getElementById('hamburger');
  const mobNav   = document.getElementById('mobNav');
  const mobClose = document.getElementById('mobClose');
  const overlay  = document.getElementById('mobOverlay');

  function openNav() {
    mobNav.classList.add('open');
    overlay.classList.add('show');
    ham.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeNav() {
    mobNav.classList.remove('open');
    overlay.classList.remove('show');
    ham.classList.remove('open');
    document.body.style.overflow = '';
  }

  ham.addEventListener('click', openNav);
  mobClose.addEventListener('click', closeNav);
  overlay.addEventListener('click', closeNav);
  document.querySelectorAll('.mob-nav nav a').forEach(a => a.addEventListener('click', closeNav));


  // ── Scroll Reveal ──
  const revealEls = document.querySelectorAll(
    '.sec-head, .about-wrap, .tl-item, .sk-card, .proj-card, .cert-card, .contact-wrap, .hero-card, .hero-left'
  );
  revealEls.forEach(el => el.classList.add('reveal'));

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // stagger siblings
        const siblings = [...entry.target.parentElement.children].filter(c => c.classList.contains('reveal'));
        const idx = siblings.indexOf(entry.target);
        setTimeout(() => entry.target.classList.add('in'), idx * 70);
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.07 });

  revealEls.forEach(el => io.observe(el));


  // ── Counter Animation ──
  const counters = document.querySelectorAll('[data-count]');
  const cio = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseFloat(el.dataset.count);
      const decimal = target % 1 !== 0;
      const duration = 1200;
      const steps = 60;
      let step = 0;

      const timer = setInterval(() => {
        step++;
        const progress = step / steps;
        const ease = 1 - Math.pow(1 - progress, 3); // ease-out cubic
        const val = target * ease;
        el.textContent = decimal ? val.toFixed(2) : Math.floor(val);
        if (step >= steps) {
          el.textContent = decimal ? target.toFixed(2) : target;
          clearInterval(timer);
        }
      }, duration / steps);

      cio.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(el => cio.observe(el));


  // ── Active Nav ──
  const sections  = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('#navbar a');

  const navIO = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(a => {
          a.classList.remove('active');
          if (a.getAttribute('href') === '#' + entry.target.id) a.classList.add('active');
        });
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach(s => navIO.observe(s));


  // ── Scroll to Top ──
  const stBtn = document.getElementById('scrollTop');
  window.addEventListener('scroll', () => {
    stBtn.classList.toggle('show', window.scrollY > 500);
  }, { passive: true });
  stBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));


  // ── Contact Form ──
  const form = document.getElementById('contactForm');
  const note = document.getElementById('cfNote');

  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('button');
    const orig = btn.innerHTML;
    btn.innerHTML = 'Sending… <i class="fas fa-spinner fa-spin"></i>';
    btn.disabled = true;

    setTimeout(() => {
      note.textContent = '✓ Message received! I\'ll get back to you soon.';
      btn.innerHTML = 'Sent! <i class="fas fa-check"></i>';
      btn.style.background = '#2e7d32';
      form.reset();
      setTimeout(() => {
        btn.innerHTML = orig;
        btn.style.background = '';
        btn.disabled = false;
        note.textContent = '';
      }, 4000);
    }, 1000);
  });


  // ── Smooth anchor scroll ──
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    });
  });

});
