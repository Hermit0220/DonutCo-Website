/* ─────────────────────────────────────
   DonutCo – Landing Page Scripts
   ───────────────────────────────────── */

(function () {
  'use strict';

  /* ── Slider ── */
  const slides   = document.querySelectorAll('.slide');
  const dots     = document.querySelectorAll('.dot');
  const prevBtn  = document.getElementById('arrow-prev');
  const nextBtn  = document.getElementById('arrow-next');
  const donuts   = [
    { name: 'Strawberry Bliss',  sub: 'Classic Ring • Rainbow Sprinkles', price: '$7.19', orig: '$8.99' },
    { name: 'Dark Velvet',       sub: 'Premium Ring • Gold Flakes',        price: '$8.39', orig: '$9.99' },
    { name: 'Berry Dream',       sub: 'Glazed Ring • Pearl Toppings',      price: '$7.59', orig: '$8.99' },
  ];

  let current = 0;
  let autoTimer;

  function goTo(idx) {
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');
    current = (idx + slides.length) % slides.length;
    slides[current].classList.add('active');
    dots[current].classList.add('active');

    // Update price tag
    const priceTag = document.getElementById('price-tag');
    if (priceTag) {
      priceTag.querySelector('.price-current').textContent = donuts[current].price;
      priceTag.querySelector('.price-original').textContent = donuts[current].orig;
    }
  }

  function startAuto() {
    autoTimer = setInterval(() => goTo(current + 1), 4000);
  }
  function resetAuto() {
    clearInterval(autoTimer);
    startAuto();
  }

  if (prevBtn) prevBtn.addEventListener('click', () => { goTo(current - 1); resetAuto(); });
  if (nextBtn) nextBtn.addEventListener('click', () => { goTo(current + 1); resetAuto(); });
  dots.forEach((dot, i) => dot.addEventListener('click', () => { goTo(i); resetAuto(); }));

  startAuto();

  /* ── Duplicate strip items for infinite marquee ── */
  const stripItems = document.querySelector('.strip-items');
  if (stripItems) {
    const clone = stripItems.innerHTML;
    stripItems.innerHTML += clone; // double for seamless loop
  }

  /* ── Search bar expand on focus ── */
  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    searchInput.addEventListener('focus', () => {
      searchInput.style.width = '200px';
    });
    searchInput.addEventListener('blur', () => {
      searchInput.style.width = '';
    });
  }

  /* ── Scroll header shadow ── */
  const header = document.querySelector('.site-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 8) {
      header.style.boxShadow = '0 4px 24px rgba(0,0,0,0.08)';
    } else {
      header.style.boxShadow = 'none';
    }
  }, { passive: true });

  /* ── Cart Badge Initialization ── */
  function updateBadge() {
    const cart = JSON.parse(localStorage.getItem('donutCart')) || [];
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    const badge = document.querySelector('.cart-badge');
    if (badge) badge.textContent = count;
  }
  updateBadge();

})();
