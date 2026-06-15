/* ============================================
   KAZAN STUDIO — Theme JavaScript
   ============================================ */

(function() {
  'use strict';

  /* --- Mobile Menu --- */
  const mobileToggle = document.querySelector('[data-mobile-toggle]');
  const mobileNav = document.querySelector('[data-mobile-nav]');

  if (mobileToggle && mobileNav) {
    mobileToggle.addEventListener('click', function() {
      const isOpen = mobileNav.classList.toggle('is-open');
      mobileToggle.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close on link click
    mobileNav.querySelectorAll('a').forEach(function(link) {
      link.addEventListener('click', function() {
        mobileNav.classList.remove('is-open');
        mobileToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  /* --- Sticky Header Background --- */
  const header = document.querySelector('[data-header]');
  if (header && header.classList.contains('site-header--transparent')) {
    function updateHeader() {
      if (window.scrollY > 80) {
        header.classList.remove('site-header--transparent');
        header.classList.add('site-header--light');
      } else {
        header.classList.remove('site-header--light');
        header.classList.add('site-header--transparent');
      }
    }
    window.addEventListener('scroll', updateHeader, { passive: true });
    updateHeader();
  }

  /* --- Product Image Gallery --- */
  const thumbnails = document.querySelectorAll('[data-thumbnail]');
  const mainImage = document.getElementById('main-product-image');

  if (thumbnails.length > 0 && mainImage) {
    thumbnails.forEach(function(thumb) {
      thumb.addEventListener('click', function() {
        // Update active state
        thumbnails.forEach(function(t) { t.classList.remove('is-active'); });
        thumb.classList.add('is-active');

        // Swap image with fade
        mainImage.style.opacity = '0';
        setTimeout(function() {
          mainImage.src = thumb.dataset.imageUrl;
          mainImage.alt = thumb.dataset.imageAlt || '';
          mainImage.style.opacity = '1';
        }, 300);
      });
    });
  }

  /* --- Collection Sort --- */
  const sortSelect = document.querySelector('[data-sort-select]');
  if (sortSelect) {
    sortSelect.addEventListener('change', function() {
      var url = new URL(window.location.href);
      url.searchParams.set('sort_by', this.value);
      window.location.href = url.toString();
    });
  }

  /* --- Commission Panel Toggle --- */
  const commissionToggle = document.querySelector('.commission-toggle');
  const commissionPanel = document.getElementById('commission-panel');

  if (commissionToggle && commissionPanel) {
    commissionToggle.addEventListener('click', function() {
      const isOpen = commissionPanel.classList.toggle('is-open');
      commissionToggle.setAttribute('aria-expanded', isOpen);
      commissionPanel.setAttribute('aria-hidden', !isOpen);
      if (isOpen) {
        commissionPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    });

    // Auto-open panel after successful form submission
    if (commissionPanel.querySelector('.commission-success')) {
      commissionPanel.classList.add('is-open');
      commissionToggle.setAttribute('aria-expanded', 'true');
      commissionPanel.setAttribute('aria-hidden', 'false');
    }
  }

  /* --- Smooth scroll for anchor links --- */
  document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* --- Load / scroll reveal ---
     Adds .is-visible as elements enter the viewport. Grids stagger their
     children. Skipped entirely when motion is reduced or IO is unsupported
     (the CSS hidden state is gated the same way, so content stays visible). */
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if ('IntersectionObserver' in window && !reduceMotion) {
    var SINGLES = [
      '.hero__content', '.featured-collection__header', '.collection-list__header',
      '.collections-index__header', '.collection-card', '.image-with-text__content',
      '.rich-text', '.newsletter .page-width', '.collection-page__header',
      '.related-products__header', '.faq-page__header', '.faq-section',
      '.contact-section__info'
    ];
    var GROUPS = [
      '.featured-collection .grid', '.collection-page .grid', '.related-products .grid'
    ];

    var io = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        if (el.hasAttribute('data-reveal-group')) {
          Array.prototype.forEach.call(el.children, function(child, i) {
            child.style.transitionDelay = (i * 70) + 'ms';
            child.classList.add('is-visible');
          });
        } else {
          el.classList.add('is-visible');
        }
        io.unobserve(el);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });

    SINGLES.forEach(function(sel) {
      document.querySelectorAll(sel).forEach(function(el) { io.observe(el); });
    });
    GROUPS.forEach(function(sel) {
      document.querySelectorAll(sel).forEach(function(el) {
        el.setAttribute('data-reveal-group', '');
        io.observe(el);
      });
    });
  }

  /* --- Product image lightbox --- */
  var lightboxTrigger = document.querySelector('[data-main-image]');
  var lightboxMainImg = document.getElementById('main-product-image');

  if (lightboxTrigger && lightboxMainImg) {
    var lightbox;

    function lightboxHiRes(src) {
      if (!src) return src;
      return src.replace(/([?&]width=)\d+/, function(match, prefix) {
        return prefix + '1600';
      });
    }

    function closeLightbox() {
      if (lightbox) {
        lightbox.classList.remove('is-open');
        document.body.style.overflow = '';
      }
    }

    function openLightbox() {
      if (!lightbox) {
        lightbox = document.createElement('div');
        lightbox.className = 'lightbox';
        lightbox.setAttribute('role', 'dialog');
        lightbox.setAttribute('aria-modal', 'true');
        lightbox.innerHTML =
          '<button class="lightbox__close" type="button" aria-label="Close">Close ✕</button>' +
          '<img alt="">';
        lightbox.addEventListener('click', closeLightbox);
        document.body.appendChild(lightbox);
      }
      var img = lightbox.querySelector('img');
      img.src = lightboxHiRes(lightboxMainImg.currentSrc || lightboxMainImg.src);
      img.alt = lightboxMainImg.alt || '';
      document.body.style.overflow = 'hidden';
      requestAnimationFrame(function() { lightbox.classList.add('is-open'); });
    }

    lightboxTrigger.addEventListener('click', openLightbox);
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') closeLightbox();
    });
  }

})();
