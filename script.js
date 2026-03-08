// =============================================
//   VENKATMOHAN VASAMSETTI — Portfolio JS
// =============================================

document.addEventListener('DOMContentLoaded', () => {

  // ===== Preloader =====
  const preloader = document.getElementById('preloader');
  window.addEventListener('load', () => {
    setTimeout(() => preloader.classList.add('done'), 800);
  });


  // ===== Custom Cursor =====
  const dot = document.querySelector('.cursor-dot');
  const outline = document.querySelector('.cursor-outline');

  if (dot && outline) {
    let mx = 0, my = 0, ox = 0, oy = 0;

    window.addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      dot.style.left = mx + 'px';
      dot.style.top  = my + 'px';
    });

    function animateOutline() {
      ox += (mx - ox) * 0.14;
      oy += (my - oy) * 0.14;
      outline.style.left = ox + 'px';
      outline.style.top  = oy + 'px';
      requestAnimationFrame(animateOutline);
    }
    animateOutline();

    document.querySelectorAll('a, button, .tag, .skill-card, .cert-card, .project-card').forEach(el => {
      el.addEventListener('mouseenter', () => {
        dot.style.transform = 'translate(-50%, -50%) scale(2)';
        outline.style.transform = 'translate(-50%, -50%) scale(1.5)';
        outline.style.borderColor = 'rgba(59,130,246,0.8)';
      });
      el.addEventListener('mouseleave', () => {
        dot.style.transform = 'translate(-50%, -50%) scale(1)';
        outline.style.transform = 'translate(-50%, -50%) scale(1)';
        outline.style.borderColor = 'rgba(59,130,246,0.5)';
      });
    });
  }


  // ===== Header Scroll =====
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 40);
  });


  // ===== Hamburger Menu =====
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobileNav');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileNav.classList.toggle('open');
  });

  document.querySelectorAll('.m-nav-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileNav.classList.remove('open');
    });
  });


  // ===== Active Nav Link on Scroll =====
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const observerNav = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + entry.target.id) {
            link.classList.add('active');
          }
        });
      }
    });
  }, { rootMargin: '-40% 0px -50% 0px' });

  sections.forEach(s => observerNav.observe(s));


  // ===== Scroll Reveal =====
  const revealEls = document.querySelectorAll(
    '.about-grid, .timeline-item, .skill-card, .project-card, .cert-card, .contact-grid, .section-label'
  );

  revealEls.forEach(el => el.classList.add('scroll-reveal'));

  const observer = new IntersectionObserver(entries => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 80);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });

  revealEls.forEach(el => observer.observe(el));


  // ===== Scroll to Top =====
  const scrollTop = document.getElementById('scrollTop');

  window.addEventListener('scroll', () => {
    scrollTop.classList.toggle('visible', window.scrollY > 400);
  });

  scrollTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));


  // ===== Typed Effect =====
  const typedEl = document.querySelector('.typed-text');
  const phrases = [
    'Industrial Automation',
    'Process Control Systems',
    'AUV Communication',
    'Embedded Engineering',
    'RF & IoT Systems',
  ];
  let pIndex = 0, cIndex = 0, deleting = false;

  function type() {
    const current = phrases[pIndex];
    if (!deleting) {
      typedEl.textContent = current.substring(0, cIndex + 1);
      cIndex++;
      if (cIndex === current.length) {
        deleting = true;
        setTimeout(type, 2000);
        return;
      }
    } else {
      typedEl.textContent = current.substring(0, cIndex - 1);
      cIndex--;
      if (cIndex === 0) {
        deleting = false;
        pIndex = (pIndex + 1) % phrases.length;
      }
    }
    setTimeout(type, deleting ? 50 : 80);
  }
  setTimeout(type, 1500);


  // ===== Counter Animation =====
  const statNums = document.querySelectorAll('.stat-num[data-count]');

  const counterObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseFloat(el.dataset.count);
        const isDecimal = target % 1 !== 0;
        const duration = 1500;
        const step = 16;
        const total = duration / step;
        let current = 0;
        let count = 0;

        const timer = setInterval(() => {
          count++;
          current = target * (count / total);
          el.textContent = isDecimal ? current.toFixed(2) : Math.floor(current);
          if (count >= total) {
            el.textContent = isDecimal ? target.toFixed(2) : target;
            clearInterval(timer);
          }
        }, step);

        counterObs.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  statNums.forEach(el => counterObs.observe(el));


  // ===== Contact Form =====
  const form = document.getElementById('contactForm');
  const note = document.getElementById('formNote');

  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    btn.textContent = 'Sending...';
    btn.disabled = true;

    setTimeout(() => {
      note.textContent = '✅ Message sent! I\'ll get back to you shortly.';
      btn.textContent = 'Send Message ✓';
      btn.style.background = '#059652';
      form.reset();
      setTimeout(() => {
        btn.textContent = 'Send Message';
        btn.style.background = '';
        btn.disabled = false;
        note.textContent = '';
      }, 4000);
    }, 1200);
  });


  // ===== Smooth Scroll for anchor links =====
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });


  // ===== Parallax glow on hero =====
  document.addEventListener('mousemove', e => {
    const glow1 = document.querySelector('.glow-1');
    const glow2 = document.querySelector('.glow-2');
    if (!glow1 || !glow2) return;

    const x = (e.clientX / window.innerWidth - 0.5) * 30;
    const y = (e.clientY / window.innerHeight - 0.5) * 30;

    glow1.style.transform = `translate(${x}px, ${y}px)`;
    glow2.style.transform = `translate(${-x * 0.7}px, ${-y * 0.7}px)`;
  });

});
