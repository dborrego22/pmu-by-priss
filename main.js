// PMU by Priss — main.js

// ─────────────────────────────────────────
// REDUCED MOTION CHECK
// ─────────────────────────────────────────
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ─────────────────────────────────────────
// DYNAMIC FOOTER YEAR
// ─────────────────────────────────────────
const yearEl = document.querySelector('.footer-year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ─────────────────────────────────────────
// NAV SCROLL SHADOW
// ─────────────────────────────────────────
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 10);
}, { passive: true });

// ─────────────────────────────────────────
// HERO ENTRANCE SEQUENCE
// ─────────────────────────────────────────
function runHeroEntrance() {
  if (prefersReducedMotion) {
    document.querySelectorAll(
      '.hero-eyebrow, .hero-headline span, .hero-sub, #hero .btn'
    ).forEach(el => {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
    return;
  }

  const eyebrow = document.querySelector('.hero-eyebrow');
  const headlineWords = document.querySelectorAll('.hero-headline span');
  const sub = document.querySelector('.hero-sub');
  const cta = document.querySelector('#hero .btn');

  const ease = 'cubic-bezier(0.22, 1, 0.36, 1)';

  // Eyebrow fades in at 200ms
  setTimeout(() => {
    eyebrow.style.transition = `opacity 400ms ${ease}`;
    eyebrow.style.opacity = '1';
  }, 200);

  // Headline words stagger in starting at 500ms (80ms per word per spec)
  headlineWords.forEach((word, i) => {
    setTimeout(() => {
      word.style.transition = `opacity 600ms ${ease}, transform 600ms ${ease}`;
      word.style.opacity = '1';
      word.style.transform = 'translateY(0)';
    }, 500 + i * 80);
  });

  // Subtext after last word
  const subDelay = 500 + (headlineWords.length * 80) + 100;
  setTimeout(() => {
    sub.style.transition = `opacity 400ms ${ease}`;
    sub.style.opacity = '1';
  }, subDelay);

  // CTA after subtext
  setTimeout(() => {
    cta.style.transition = `opacity 300ms ${ease}, transform 300ms ${ease}`;
    cta.style.opacity = '1';
    cta.style.transform = 'scale(1)';
  }, subDelay + 300);
}

// Run after fonts are loaded to avoid FOUT during animation
if (document.fonts && document.fonts.ready) {
  document.fonts.ready.then(runHeroEntrance);
} else {
  window.addEventListener('load', runHeroEntrance);
}

// ─────────────────────────────────────────
// SCROLL REVEAL — IntersectionObserver
// ─────────────────────────────────────────

// Set initial hidden state for all .reveal elements
document.querySelectorAll('.reveal').forEach(el => {
  if (!prefersReducedMotion) {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
  }
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;

      if (prefersReducedMotion) {
        el.style.opacity = '1';
        el.style.transform = 'none';
        revealObserver.unobserve(el);
        return;
      }

      const ease = 'cubic-bezier(0.22, 1, 0.36, 1)';
      el.style.transition = `opacity 500ms ${ease}, transform 500ms ${ease}`;
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
      revealObserver.unobserve(el);
    }
  });
}, {
  threshold: 0.15,
  rootMargin: '0px 0px -40px 0px'
});

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ─────────────────────────────────────────
// SERVICE ITEMS STAGGER (slide from left)
// ─────────────────────────────────────────
document.querySelectorAll('.service-item').forEach(item => {
  if (!prefersReducedMotion) {
    item.style.opacity = '0';
    item.style.transform = 'translateX(-16px)';
  }
});

const serviceObserver = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting) {
    serviceObserver.disconnect();
    document.querySelectorAll('.service-item').forEach((item, i) => {
      if (prefersReducedMotion) {
        item.style.opacity = '1';
        item.style.transform = 'none';
        return;
      }
      const ease = 'cubic-bezier(0.22, 1, 0.36, 1)';
      setTimeout(() => {
        item.style.transition = `opacity 500ms ${ease}, transform 500ms ${ease}`;
        item.style.opacity = '1';
        item.style.transform = 'translateX(0)';
      }, i * 60);
    });
  }
}, { threshold: 0.1 });

const serviceList = document.querySelector('.service-list');
if (serviceList) serviceObserver.observe(serviceList);

// ─────────────────────────────────────────
// TIKTOK CARDS STAGGER (slide from right)
// ─────────────────────────────────────────
document.querySelectorAll('.tiktok-card').forEach(card => {
  if (!prefersReducedMotion) {
    card.style.opacity = '0';
    card.style.transform = 'translateX(20px)';
  }
});

const tiktokObserver = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting) {
    // Disconnect first to prevent observer leak on both reduced-motion and normal paths
    tiktokObserver.disconnect();

    document.querySelectorAll('.tiktok-card').forEach((card, i) => {
      if (prefersReducedMotion) {
        card.style.opacity = '1';
        card.style.transform = 'none';
        return;
      }
      const ease = 'cubic-bezier(0.22, 1, 0.36, 1)';
      setTimeout(() => {
        card.style.transition = `opacity 500ms ${ease}, transform 500ms ${ease}`;
        card.style.opacity = '1';
        card.style.transform = 'translateX(0)';
      }, i * 80);
    });
  }
}, { threshold: 0.1 });

const tiktokGrid = document.querySelector('.tiktok-grid');
if (tiktokGrid) tiktokObserver.observe(tiktokGrid);
