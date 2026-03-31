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

})();
