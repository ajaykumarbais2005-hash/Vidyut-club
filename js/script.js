/* Vidyut Club landing page interactions
   - Theme toggle with localStorage and smooth transition
   - Navbar scroll/active state, mobile menu, animated indicator
   - Smooth scrolling, staggered scroll reveals, back-to-top
   - Lightweight hero particles and subtle hero motion
   - Frontend-only registration form demo with validation
   - Visual enhancements: preloader, card spotlight/tilt, magnetic buttons
*/

(function () {
  const doc = document;
  const root = doc.documentElement;
  const body = doc.body;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  function ready(fn) {
    if (doc.readyState === 'loading') {
      doc.addEventListener('DOMContentLoaded', fn);
    } else {
      fn();
    }
  }

  ready(() => {
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
    }

    initTheme();
    initPageLoader();
    initNavbar();
    initSmoothScroll();
    initPlaceholderLinks();
    initRevealStagger();
    initRevealAnimations();
    initBackToTop();
    initHeroParticles();
    initRegistrationForm();
    initCardSpotlight();
    initCardTilt();
    initMagneticButtons();
    initHeroMotion();
  });

  function initPlaceholderLinks() {
    const links = doc.querySelectorAll('a[data-placeholder="true"]');
    links.forEach((link) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
      });
      link.removeAttribute('aria-disabled');
    });
  }

  /* Theme */
  function initTheme() {
    const toggle = doc.getElementById('theme-toggle');
    const storageKey = 'vidyut-theme';
    const saved = localStorage.getItem(storageKey);
    const initial = saved === 'light' || saved === 'dark' ? saved : 'dark';

    applyTheme(initial);

    if (!toggle) return;
    toggle.addEventListener('click', () => {
      const current = root.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
      const next = current === 'dark' ? 'light' : 'dark';
      withThemeTransition(() => {
        applyTheme(next);
        localStorage.setItem(storageKey, next);
      });
    });

    function applyTheme(theme) {
      root.setAttribute('data-theme', theme);
      const isLight = theme === 'light';
      if (toggle) {
        toggle.setAttribute('aria-pressed', String(isLight));
        toggle.setAttribute('aria-label', isLight ? 'Switch to dark mode' : 'Switch to light mode');
        toggle.setAttribute('title', isLight ? 'Switch to dark mode' : 'Switch to light mode');
      }
      const metaTheme = doc.querySelector('meta[name="theme-color"]');
      if (metaTheme) metaTheme.setAttribute('content', isLight ? '#f3f6fc' : '#060814');
    }

    function withThemeTransition(update) {
      if (prefersReducedMotion) {
        update();
        return;
      }
      root.classList.add('theme-transition');
      update();
      window.setTimeout(() => root.classList.remove('theme-transition'), 550);
    }
  }

  /* Page loader */
  function initPageLoader() {
    const loader = doc.getElementById('page-loader');
    if (!loader) return;
    if (prefersReducedMotion) {
      loader.classList.add('is-hidden');
      window.setTimeout(() => loader.remove(), 50);
      return;
    }

    const minDelay = 450;
    const start = performance.now();

    function hide() {
      const elapsed = performance.now() - start;
      const wait = Math.max(0, minDelay - elapsed);
      window.setTimeout(() => {
        loader.classList.add('is-hidden');
        window.setTimeout(() => {
          if (loader.parentNode) loader.remove();
        }, 700);
      }, wait);
    }

    if (doc.readyState === 'complete') {
      hide();
    } else {
      window.addEventListener('load', hide, { once: true });
      window.setTimeout(hide, 2200);
    }
  }

  /* Navbar, mobile menu, active links, animated indicator */
  function initNavbar() {
    const navbar = doc.querySelector('.navbar');
    const toggle = doc.querySelector('.nav-toggle');
    const menu = doc.getElementById('primary-menu');
    const navLinksWrap = doc.querySelector('.nav-links-wrap');
    const indicator = doc.querySelector('.nav-indicator');
    const navLinks = Array.from(doc.querySelectorAll('.nav-link'));
    const sections = navLinks
      .map((link) => doc.querySelector(link.getAttribute('href')))
      .filter(Boolean);

    function onScroll() {
      if (!navbar) return;
      navbar.classList.toggle('scrolled', window.scrollY > 12);
      updateActiveLink();
    }

    function updateActiveLink() {
      const offset = 140;
      let currentId = sections[0] ? sections[0].id : '';
      sections.forEach((section) => {
        const top = section.offsetTop - offset;
        if (window.scrollY >= top) currentId = section.id;
      });
      navLinks.forEach((link) => {
        const isActive = link.getAttribute('href') === `#${currentId}`;
        link.classList.toggle('active', isActive);
        if (isActive) {
          link.setAttribute('aria-current', 'page');
        } else {
          link.removeAttribute('aria-current');
        }
      });
      updateIndicator();
    }

    function updateIndicator() {
      if (!indicator || !navLinksWrap) return;
      const active = navLinksWrap.querySelector('.nav-link.active');
      const isMobile = window.innerWidth <= 900;
      if (!active || isMobile) {
        indicator.style.opacity = '0';
        return;
      }
      const wrapRect = navLinksWrap.getBoundingClientRect();
      const linkRect = active.getBoundingClientRect();
      const x = linkRect.left - wrapRect.left;
      indicator.style.width = `${linkRect.width}px`;
      indicator.style.transform = `translateX(${x}px)`;
      indicator.style.opacity = '1';
    }

    function setMenu(open) {
      if (!toggle || !menu) return;
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
      menu.classList.toggle('open', open);
      if (body) body.style.overflow = open && window.innerWidth <= 900 ? 'hidden' : '';
      window.requestAnimationFrame(updateIndicator);
    }

    if (toggle && menu) {
      toggle.addEventListener('click', () => {
        const open = toggle.getAttribute('aria-expanded') === 'true';
        setMenu(!open);
      });

      navLinks.forEach((link) => {
        link.addEventListener('click', () => setMenu(false));
      });

      doc.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') setMenu(false);
      });

      doc.addEventListener('click', (e) => {
        if (!menu.classList.contains('open')) return;
        if (menu.contains(e.target) || toggle.contains(e.target)) return;
        setMenu(false);
      });
    }

    window.addEventListener('resize', () => {
      if (window.innerWidth > 900) {
        setMenu(false);
        if (body) body.style.overflow = '';
      }
      updateIndicator();
    });

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('load', updateIndicator, { once: true });
    onScroll();
    window.requestAnimationFrame(updateIndicator);
  }

  /* Smooth scroll for in-page anchors */
  function initSmoothScroll() {
    const links = doc.querySelectorAll('a[href^="#"]');
    links.forEach((link) => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (!href || href === '#') return;
        if (link.hasAttribute('data-placeholder')) return;
        const target = doc.querySelector(href);
        if (!target) return;
        e.preventDefault();
        const navHeight = parseInt(getComputedStyle(root).getPropertyValue('--nav-height'), 10) || 80;
        const top = target.getBoundingClientRect().top + window.scrollY - navHeight + 6;
        window.scrollTo({ top: Math.max(0, top), behavior: prefersReducedMotion ? 'auto' : 'smooth' });
        if (history && typeof history.pushState === 'function') {
          history.pushState(null, '', href);
        }

        const hadTabIndex = target.hasAttribute('tabindex');
        if (!hadTabIndex) target.setAttribute('tabindex', '-1');
        target.focus({ preventScroll: true });
        if (!hadTabIndex) {
          target.addEventListener('blur', () => target.removeAttribute('tabindex'), { once: true });
        }
      });
    });
  }

  /* Stagger reveal delays within groups */
  function initRevealStagger() {
    const groups = [
      '.feature-grid .reveal',
      '.events-grid .reveal',
      '.team-grid .reveal',
      '.benefits-grid .reveal',
      '.hero-highlights li',
      '.hero-stats .hero-stat'
    ];
    groups.forEach((selector) => {
      const items = Array.from(doc.querySelectorAll(selector));
      items.forEach((el, index) => {
        el.style.setProperty('--reveal-delay', `${Math.min(index * 70, 320)}ms`);
        if (!el.classList.contains('reveal') && (el.matches('.hero-highlights li') || el.matches('.hero-stat'))) {
          el.classList.add('reveal');
        }
      });
    });
  }

  /* Scroll reveal */
  function initRevealAnimations() {
    const items = Array.from(doc.querySelectorAll('.reveal'));
    if (!items.length) return;

    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      items.forEach((el) => el.classList.add('in-view'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    items.forEach((el) => observer.observe(el));
  }

  /* Back to top */
  function initBackToTop() {
    const btn = doc.getElementById('back-to-top');
    if (!btn) return;

    function toggleBtn() {
      btn.classList.toggle('show', window.scrollY > 500);
    }

    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    });

    window.addEventListener('scroll', toggleBtn, { passive: true });
    toggleBtn();
  }

  /* Hero particles (lightweight canvas) */
  function initHeroParticles() {
    const canvas = doc.getElementById('hero-particles');
    if (!canvas) return;
    if (prefersReducedMotion) {
      canvas.style.display = 'none';
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let particles = [];
    let rafId = 0;

    function resize() {
      const rect = canvas.parentElement.getBoundingClientRect();
      width = Math.max(1, Math.floor(rect.width));
      height = Math.max(1, Math.floor(rect.height));
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      createParticles();
    }

    function createParticles() {
      const count = Math.min(46, Math.max(20, Math.floor(width / 26)));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 1.7 + 0.35,
        vx: (Math.random() - 0.5) * 0.22,
        vy: (Math.random() - 0.5) * 0.22,
        a: Math.random() * 0.45 + 0.18
      }));
    }

    function draw() {
      ctx.clearRect(0, 0, width, height);
      const isLight = root.getAttribute('data-theme') === 'light';
      const dot = isLight ? '59,130,246' : '34,211,238';
      const line = isLight ? '99,102,241' : '139,92,246';

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;
        if (p.y < -10) p.y = height + 10;
        if (p.y > height + 10) p.y = -10;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${dot},${p.a})`;
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const dx = p.x - q.x;
          const dy = p.y - q.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = `rgba(${line},${(1 - dist / 120) * 0.13})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }
      rafId = window.requestAnimationFrame(draw);
    }

    resize();
    draw();

    let resizeTimer;
    window.addEventListener('resize', () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(resize, 120);
    });

    doc.addEventListener('visibilitychange', () => {
      if (doc.hidden) {
        window.cancelAnimationFrame(rafId);
      } else {
        window.cancelAnimationFrame(rafId);
        rafId = window.requestAnimationFrame(draw);
      }
    });
  }

  /* Pointer spotlight for cards */
  function initCardSpotlight() {
    if (prefersReducedMotion || !finePointer) return;
    const cards = doc.querySelectorAll('.feature-card, .event-card, .team-card, .benefit-item');
    cards.forEach((card) => {
      card.addEventListener('pointermove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        card.style.setProperty('--spot-x', `${x}%`);
        card.style.setProperty('--spot-y', `${y}%`);
      });
      card.addEventListener('pointerleave', () => {
        card.style.setProperty('--spot-x', '50%');
        card.style.setProperty('--spot-y', '50%');
      });
    });
  }

  /* Subtle 3D card tilt */
  function initCardTilt() {
    if (prefersReducedMotion || !finePointer) return;
    const cards = doc.querySelectorAll('.feature-card, .event-card, .team-card');
    cards.forEach((card) => {
      card.classList.add('tilt-card');
      let raf = 0;

      function onMove(e) {
        const rect = card.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width;
        const py = (e.clientY - rect.top) / rect.height;
        const rotateY = (px - 0.5) * 6;
        const rotateX = (0.5 - py) * 5;
        if (raf) cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => {
          card.style.transform = `perspective(900px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-6px)`;
        });
      }

      function onLeave() {
        if (raf) cancelAnimationFrame(raf);
        card.style.transform = '';
      }

      card.addEventListener('pointermove', onMove);
      card.addEventListener('pointerleave', onLeave);
      card.addEventListener('pointerdown', onLeave);
    });
  }

  /* Magnetic buttons */
  function initMagneticButtons() {
    if (prefersReducedMotion || !finePointer) return;
    const buttons = doc.querySelectorAll('.btn-primary, .btn-secondary');
    buttons.forEach((btn) => {
      btn.classList.add('btn-magnetic');
      let raf = 0;

      btn.addEventListener('pointermove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        const moveX = Math.max(-4, Math.min(4, x * 0.08));
        const moveY = Math.max(-3, Math.min(3, y * 0.12));
        if (raf) cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => {
          btn.style.transform = `translate(${moveX}px, ${moveY}px)`;
        });
      });

      function reset() {
        if (raf) cancelAnimationFrame(raf);
        btn.style.transform = '';
      }

      btn.addEventListener('pointerleave', reset);
      btn.addEventListener('blur', reset);
    });
  }

  /* Subtle hero motion */
  function initHeroMotion() {
    if (prefersReducedMotion || !finePointer) return;
    const hero = doc.querySelector('.hero');
    const visual = doc.querySelector('.hero-card-main');
    if (!hero || !visual) return;

    let raf = 0;
    hero.addEventListener('pointermove', (e) => {
      const rect = hero.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        visual.style.transform = `rotateY(${-4 + px * 4}deg) rotateX(${1.5 - py * 3}deg) translateY(-2px)`;
      });
    });

    hero.addEventListener('pointerleave', () => {
      if (raf) cancelAnimationFrame(raf);
      visual.style.transform = '';
    });
  }

  /* Registration form */
  function initRegistrationForm() {
    const form = doc.getElementById('registration-form');
    if (!form) return;

    const submitBtn = doc.getElementById('submit-btn');
    const statusBox = doc.getElementById('form-status');
    const fields = {
      fullName: form.elements.namedItem('fullName'),
      email: form.elements.namedItem('email'),
      department: form.elements.namedItem('department'),
      year: form.elements.namedItem('year'),
      interest: form.elements.namedItem('interest'),
      message: form.elements.namedItem('message')
    };

    function setError(name, message) {
      const field = fields[name];
      if (!field) return;
      const wrapper = field.closest('.form-field');
      const errorEl = doc.getElementById(`${name}-error`);
      if (wrapper) wrapper.classList.toggle('invalid', Boolean(message));
      field.setAttribute('aria-invalid', message ? 'true' : 'false');
      if (errorEl) errorEl.textContent = message || '';
    }

    function clearErrors() {
      Object.keys(fields).forEach((name) => setError(name, ''));
    }

    function showStatus(type, html) {
      if (!statusBox) return;
      statusBox.classList.toggle('is-error', type === 'error');
      statusBox.innerHTML = html;
      statusBox.classList.add('show');
      if (typeof statusBox.scrollIntoView === 'function') {
        statusBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
      try {
        statusBox.focus({ preventScroll: true });
      } catch (_) {
        statusBox.focus();
      }
    }

    function clearStatus() {
      if (!statusBox) return;
      statusBox.classList.remove('show', 'is-error');
      statusBox.textContent = '';
    }

    function getValues() {
      return {
        fullName: String(fields.fullName.value || '').trim(),
        email: String(fields.email.value || '').trim(),
        department: String(fields.department.value || '').trim(),
        year: String(fields.year.value || '').trim(),
        interest: String(fields.interest.value || '').trim(),
        message: String(fields.message.value || '').trim()
      };
    }

    function validate() {
      clearErrors();
      let firstInvalid = null;
      const values = getValues();

      if (!values.fullName) {
        setError('fullName', 'Please enter your full name.');
        firstInvalid = firstInvalid || fields.fullName;
      }

      if (!values.email) {
        setError('email', 'Please enter your college email address.');
        firstInvalid = firstInvalid || fields.email;
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(values.email)) {
        setError('email', 'Please enter a valid email address (e.g. name@college.edu).');
        firstInvalid = firstInvalid || fields.email;
      }

      if (!values.department) {
        setError('department', 'Please enter your department.');
        firstInvalid = firstInvalid || fields.department;
      }

      if (!values.year) {
        setError('year', 'Please select your year of study.');
        firstInvalid = firstInvalid || fields.year;
      }

      if (!values.interest) {
        setError('interest', 'Please select your area of interest.');
        firstInvalid = firstInvalid || fields.interest;
      }

      if (!values.message) {
        setError('message', 'Please share a short message about your interest.');
        firstInvalid = firstInvalid || fields.message;
      } else if (values.message.length < 10) {
        setError('message', 'Please provide a bit more detail (at least 10 characters).');
        firstInvalid = firstInvalid || fields.message;
      }

      return { valid: !firstInvalid, firstInvalid, values };
    }

    function setSubmitting(isSubmitting) {
      if (submitBtn) submitBtn.classList.toggle('is-loading', isSubmitting);
      Array.from(form.elements).forEach((el) => { el.disabled = isSubmitting; });
    }

    function buildMailto(values) {
      const to = String(form.dataset.mailto || 'vidyutclub@example.edu').trim();
      const subject = `Vidyut Club Registration: ${values.fullName || 'New interest'}`;
      const body = [
        'Vidyut Club registration interest',
        '',
        `Full Name: ${values.fullName}`,
        `College Email: ${values.email}`,
        `Department: ${values.department}`,
        `Year of Study: ${values.year}`,
        `Area of Interest: ${values.interest}`,
        '',
        'Message:',
        values.message
      ].join('\n');
      return `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    }

    Object.entries(fields).forEach(([name, field]) => {
      if (!field) return;
      const eventName = field.tagName === 'SELECT' ? 'change' : 'input';
      field.addEventListener(eventName, () => {
        if (field.closest('.form-field')?.classList.contains('invalid')) {
          const current = String(field.value || '').trim();
          if (current) setError(name, '');
        }
      });
    });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      clearStatus();

      const { valid, firstInvalid, values } = validate();
      if (!valid) {
        if (firstInvalid && typeof firstInvalid.focus === 'function') firstInvalid.focus();
        return;
      }

      setSubmitting(true);

      const endpoint = String(form.dataset.endpoint || '').trim();
      const isHttpEndpoint = /^https?:\/\//i.test(endpoint);

      try {
        if (isHttpEndpoint) {
          const response = await fetch(endpoint, {
            method: 'POST',
            headers: { Accept: 'application/json' },
            body: new FormData(form)
          });

          let data = null;
          try {
            data = await response.json();
          } catch (_) {
            data = null;
          }

          const responseMessage = data && (data.message || data.error || data.success)
            ? String(data.message || data.error || data.success)
            : '';
          const hasError = !response.ok || (data && (data.success === false || data.success === 'false'));

          if (hasError) {
            throw new Error(responseMessage || 'The server could not accept the submission. Please try again in a moment.');
          }

          form.reset();
          clearErrors();

          const normalizedMessage = responseMessage.toLowerCase();
          const needsAction = /activate|activation|confirm|verification|verify/.test(normalizedMessage);
          if (needsAction) {
            showStatus(
              'success',
              `<strong>Submission received, but action is required.</strong> ${responseMessage || 'Please check the club email inbox for a confirmation or activation message from the form service and complete it so submissions are delivered.'}`
            );
          } else {
            const successText = responseMessage || 'Your interest has been sent to Vidyut Club.';
            showStatus('success', `<strong>Submitted successfully.</strong> ${successText}`);
          }
        } else {
          const mailto = buildMailto(values);
          window.location.href = mailto;
          form.reset();
          clearErrors();
          showStatus('success', '<strong>Email draft opened.</strong> Your registration details were added to a new message in your email app. Please send it to complete your submission.');
        }
      } catch (err) {
        const detail = err && err.message ? String(err.message) : 'Please check your connection or try again later.';
        const offlineHint = typeof navigator !== 'undefined' && navigator && navigator.onLine === false ? ' You appear to be offline.' : '';
        showStatus('error', `<strong>Could not submit right now.</strong> ${detail}${offlineHint}`);
      } finally {
        setSubmitting(false);
      }
    });
  }
})();
