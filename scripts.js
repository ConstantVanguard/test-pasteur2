/* ============================================================
   scripts.js — reverend.be Refonte 2026
   Fonctions JS partagées : scroll animations, lightbox galerie,
   smooth scroll pour ancres internes.
   À charger AVANT les scripts de service (mariage-script.js, etc.)
   ============================================================ */

(function () {
  'use strict';

  /* ─── Scroll-triggered reveal animations ─────────────── */
  function initScrollReveal() {
    if (!('IntersectionObserver' in window)) {
      // Fallback : tout visible immédiatement
      document.querySelectorAll('.reveal').forEach(function (el) {
        el.classList.add('in-view');
      });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      rootMargin: '0px 0px -60px 0px',
      threshold: 0.1
    });

    document.querySelectorAll('.reveal').forEach(function (el) {
      observer.observe(el);
    });
  }

  /* ─── Lightbox galerie ───────────────────────────────── */
  function initLightbox() {
    var galleries = document.querySelectorAll('.image-gallery');
    if (galleries.length === 0) return;

    // Créer le lightbox s'il n'existe pas
    var lightbox = document.getElementById('lightbox');
    if (!lightbox) {
      lightbox = document.createElement('div');
      lightbox.id = 'lightbox';
      lightbox.className = 'lightbox';
      lightbox.innerHTML =
        '<button class="lightbox-close" aria-label="Fermer">&times;</button>' +
        '<img src="" alt="">';
      document.body.appendChild(lightbox);
    }

    var lightboxImg = lightbox.querySelector('img');
    var closeBtn = lightbox.querySelector('.lightbox-close');

    document.querySelectorAll('.gallery-image').forEach(function (img) {
      img.style.cursor = 'zoom-in';
      img.addEventListener('click', function () {
        lightboxImg.src = this.src;
        lightboxImg.alt = this.alt || '';
        lightbox.classList.add('open');
        document.body.style.overflow = 'hidden';
      });
    });

    function close() {
      lightbox.classList.remove('open');
      document.body.style.overflow = '';
    }
    closeBtn.addEventListener('click', close);
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) close();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && lightbox.classList.contains('open')) close();
    });
  }

  /* ─── Smooth scroll pour les ancres internes ─────────── */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener('click', function (e) {
        var href = this.getAttribute('href');
        if (href === '#' || href === '') return;
        var target = document.querySelector(href);
        if (!target) return;
        e.preventDefault();
        var headerHeight = document.querySelector('.site-header') ? document.querySelector('.site-header').offsetHeight : 0;
        var topOffset = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;
        window.scrollTo({ top: topOffset, behavior: 'smooth' });
        // Fermer le menu mobile s'il est ouvert
        var mobileMenu = document.getElementById('mobile-menu');
        var hamburgerButton = document.getElementById('hamburger-button');
        if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
          mobileMenu.classList.add('hidden');
          if (hamburgerButton) hamburgerButton.classList.remove('open');
        }
      });
    });
  }

  /* ─── Hamburger button visual feedback ──────────────── */
  function initHamburgerVisual() {
    var btn = document.getElementById('hamburger-button');
    var menu = document.getElementById('mobile-menu');
    if (!btn || !menu) return;
    // Observer la classe hidden pour basculer .open sur le bouton
    var observer = new MutationObserver(function () {
      if (menu.classList.contains('hidden')) {
        btn.classList.remove('open');
      } else {
        btn.classList.add('open');
      }
    });
    observer.observe(menu, { attributes: true, attributeFilter: ['class'] });
  }

  /* ─── Init au chargement ─────────────────────────────── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      initScrollReveal();
      initLightbox();
      initSmoothScroll();
      initHamburgerVisual();
    });
  } else {
    initScrollReveal();
    initLightbox();
    initSmoothScroll();
    initHamburgerVisual();
  }
})();
