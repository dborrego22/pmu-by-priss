// PMU by Priss — main.js

// ─────────────────────────────────────────
// PREVENT BROWSER FROM RESTORING SCROLL POSITION
// ─────────────────────────────────────────
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}

// ─────────────────────────────────────────
// REDUCED MOTION CHECK
// ─────────────────────────────────────────
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ─────────────────────────────────────────
// TIKTOK IN-APP BROWSER BANNER
// ─────────────────────────────────────────

// Detect TikTok in-app browser
function isTikTokApp() {
  const ua = navigator.userAgent.toLowerCase();
  return ua.includes('tiktok') || ua.includes('musical.ly') || ua.includes('bytedance');
}

// ONLY on TikTok: setup banner for SMS booking failures
if (isTikTokApp()) {
  function setupBannerHandlers() {
    const banner = document.getElementById('tiktokBanner');
    const openBtn = document.getElementById('openBrowserBtn');
    const dismissBtn = document.getElementById('dismissBannerBtn');

    if (!banner) return;

    // Open in external browser using temporary anchor tag
    if (openBtn && !openBtn.dataset.listenerAttached) {
      openBtn.dataset.listenerAttached = 'true';
      openBtn.addEventListener('click', () => {
        // Create temporary link with target="_blank"
        const link = document.createElement('a');
        link.href = window.location.href;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      });
    }

    // Dismiss button
    if (dismissBtn && !dismissBtn.dataset.listenerAttached) {
      dismissBtn.dataset.listenerAttached = 'true';
      dismissBtn.addEventListener('click', () => {
        banner.classList.remove('show');
      });
    }

    // Attach click handlers to SMS links to show banner when clicked
    document.querySelectorAll('a[href^="sms:"]').forEach(link => {
      if (!link.dataset.bannerListenerAttached) {
        link.dataset.bannerListenerAttached = 'true';
        link.addEventListener('click', (e) => {
          // Show banner immediately when SMS link is clicked (will fail on TikTok)
          banner.classList.add('show');
        });
      }
    });
  }

  // Setup on page load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupBannerHandlers);
  } else {
    setupBannerHandlers();
  }

  // Re-setup periodically in case SMS links are added dynamically
  setInterval(setupBannerHandlers, 500);
}

// ─────────────────────────────────────────
// DYNAMIC FOOTER YEAR
// ─────────────────────────────────────────
const yearEl = document.querySelector('.footer-year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ─────────────────────────────────────────
// NAV SCROLL SHADOW
// ─────────────────────────────────────────
const nav = document.getElementById('nav');
if (nav) {
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 10);
  }, { passive: true });
}

// ─────────────────────────────────────────
// HERO ENTRANCE SEQUENCE
// ─────────────────────────────────────────
function runHeroEntrance() {
  const eyebrow = document.querySelector('.hero-eyebrow');
  const headlineWords = document.querySelectorAll('.hero-headline span');
  const sub = document.querySelector('.hero-sub');
  const cta = document.querySelector('#hero .btn');

  if (prefersReducedMotion) {
    [eyebrow, sub, cta].forEach(el => {
      if (!el) return;
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
    headlineWords.forEach(el => {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
    return;
  }

  const ease = 'cubic-bezier(0.22, 1, 0.36, 1)';

  // Eyebrow fades in at 200ms
  if (eyebrow) {
    setTimeout(() => {
      eyebrow.style.transition = `opacity 400ms ${ease}`;
      eyebrow.style.opacity = '1';
    }, 200);
  }

  // Headline words stagger in starting at 500ms (80ms per word per spec)
  // Add scale effect for sophisticated growth animation
  headlineWords.forEach((word, i) => {
    setTimeout(() => {
      word.style.transition = `opacity 600ms ${ease}, transform 600ms ${ease}`;
      word.style.opacity = '1';
      word.style.transform = 'translateY(0) scale(1)';
    }, 500 + i * 80);
  });

  // Subtext after last word
  const subDelay = 500 + (headlineWords.length * 80) + 100;
  if (sub) {
    setTimeout(() => {
      sub.style.transition = `opacity 400ms ${ease}`;
      sub.style.opacity = '1';
    }, subDelay);
  }

  // CTA after subtext
  if (cta) {
    setTimeout(() => {
      cta.style.transition = `opacity 300ms ${ease}, transform 300ms ${ease}`;
      cta.style.opacity = '1';
      cta.style.transform = 'scale(1)';
    }, subDelay + 300);
  }
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

// ─────────────────────────────────────────
// HAMBURGER MENU
// ─────────────────────────────────────────
const hamburgerBtn = document.getElementById('hamburgerBtn');
const navMenu = document.getElementById('navMenu');

if (hamburgerBtn && navMenu) {
  hamburgerBtn.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('is-open');
    hamburgerBtn.classList.toggle('is-open', isOpen);
    hamburgerBtn.setAttribute('aria-expanded', String(isOpen));
    navMenu.setAttribute('aria-hidden', String(!isOpen));
  });

  // Close menu when clicking on a link
  navMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('is-open');
      hamburgerBtn.classList.remove('is-open');
      hamburgerBtn.setAttribute('aria-expanded', 'false');
      navMenu.setAttribute('aria-hidden', 'true');
    });
  });

  // Close menu when clicking anywhere outside
  document.addEventListener('click', (e) => {
    if (!hamburgerBtn.contains(e.target) && !navMenu.contains(e.target)) {
      navMenu.classList.remove('is-open');
      hamburgerBtn.classList.remove('is-open');
      hamburgerBtn.setAttribute('aria-expanded', 'false');
      navMenu.setAttribute('aria-hidden', 'true');
    }
  });
}

// ─────────────────────────────────────────
// BOOK NOW — city SMS button toggle
// ─────────────────────────────────────────
const bookTrigger = document.getElementById('bookTrigger');
const bookOptions = document.getElementById('bookOptions');

if (bookTrigger && bookOptions) {
  bookTrigger.addEventListener('click', () => {
    const isOpen = bookOptions.classList.toggle('is-open');
    bookTrigger.setAttribute('aria-expanded', String(isOpen));
    bookOptions.setAttribute('aria-hidden', String(!isOpen));
  });

  // Close when clicking anywhere outside the toggle area
  document.addEventListener('click', (e) => {
    if (!bookTrigger.contains(e.target) && !bookOptions.contains(e.target)) {
      bookOptions.classList.remove('is-open');
      bookTrigger.setAttribute('aria-expanded', 'false');
      bookOptions.setAttribute('aria-hidden', 'true');
    }
  });
}

// ─────────────────────────────────────────
// GALLERY LIGHTBOX MODAL
// ─────────────────────────────────────────
const galleryPhotos = document.querySelectorAll('.gallery-photo[data-gallery-index]');
const galleryModal = document.getElementById('galleryModal');

if (galleryPhotos.length > 0 && galleryModal) {
  let currentIndex = 0;

  const showPhoto = (index) => {
    if (index < 0 || index >= galleryPhotos.length) return;
    currentIndex = index;

    const photoBtn = galleryPhotos[index];
    const img = photoBtn.querySelector('img');
    const modalImg = document.getElementById('galleryModalImg');
    const counter = document.getElementById('galleryModalCounter');

    if (modalImg && img) {
      modalImg.src = img.src;
      modalImg.alt = img.alt;
    }
    if (counter) {
      counter.textContent = `${index + 1} / ${galleryPhotos.length}`;
    }
  };

  const openModal = (index) => {
    showPhoto(index);
    galleryModal.classList.add('modal-open');
    galleryModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    galleryModal.classList.remove('modal-open');
    galleryModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  // Click to open
  galleryPhotos.forEach((photo, i) => {
    photo.addEventListener('click', (e) => {
      e.stopPropagation();
      openModal(i);
    });
  });

  // Close button
  const closeBtn = document.getElementById('galleryModalClose');
  if (closeBtn) {
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      closeModal();
    });
  }

  // Next button
  const nextBtn = document.getElementById('galleryModalNext');
  if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      showPhoto(currentIndex + 1);
    });
  }

  // Prev button
  const prevBtn = document.getElementById('galleryModalPrev');
  if (prevBtn) {
    prevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      showPhoto(currentIndex - 1);
    });
  }

  // Keyboard
  document.addEventListener('keydown', (e) => {
    if (!galleryModal || galleryModal.classList.contains('modal-open') === false) return;
    if (e.key === 'Escape') closeModal();
    if (e.key === 'ArrowRight') showPhoto(currentIndex + 1);
    if (e.key === 'ArrowLeft') showPhoto(currentIndex - 1);
  });

  // Click outside modal to close
  galleryModal.addEventListener('click', (e) => {
    if (e.target === galleryModal) closeModal();
  });
}

// ─────────────────────────────────────────
// TIKTOK CLICK-TO-PLAY
// ─────────────────────────────────────────
document.querySelectorAll('.tiktok-card[data-tiktok-id]').forEach(card => {
  const activate = () => {
    if (card.classList.contains('is-playing')) return;
    const id = card.dataset.tiktokId;
    const iframe = document.createElement('iframe');
    iframe.src = `https://www.tiktok.com/embed/v2/${id}?autoplay=1`;
    iframe.allowFullscreen = true;
    iframe.scrolling = 'no';
    iframe.allow = 'encrypted-media; autoplay';
    iframe.title = card.querySelector('img')?.alt || 'TikTok video';
    card.appendChild(iframe);
    card.classList.add('is-playing');
  };
  card.addEventListener('click', activate);
  card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') activate(); });
});
