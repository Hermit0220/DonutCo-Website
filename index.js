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
    { name: 'Strawberry Bliss',  sub: 'Classic Ring • Rainbow Sprinkles', price: 'Rs. 2000', orig: 'Rs. 2500' },
    { name: 'Dark Velvet',       sub: 'Premium Ring • Gold Flakes',       price: 'Rs. 2350', orig: 'Rs. 2800' },
    { name: 'Berry Dream',       sub: 'Glazed Ring • Pearl Toppings',     price: 'Rs. 2100', orig: 'Rs. 2500' },
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

  function updateBadge() {
    let cart = [];
    try {
      const parsed = JSON.parse(localStorage.getItem('donutCart'));
      if (Array.isArray(parsed)) cart = parsed;
    } catch (e) {
      console.error(e);
    }
    const count = cart.reduce((sum, item) => sum + (parseInt(item.quantity) || 0), 0);
    const badge = document.querySelector('.cart-badge');
    if (badge) badge.textContent = count;
  }
  updateBadge();

  /* ── Add to Cart Buttons on Main Page ── */
  const addBtns = document.querySelectorAll('.add-to-cart-btn');
  addBtns.forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      const card = this.closest('.product-card');
      const name = card.querySelector('.product-name').textContent;
      // Extract numeric value from "Rs. 800"
      const priceText = card.querySelector('.price').textContent;
      const price = parseFloat(priceText.replace(/[^0-9.]/g, ''));
      const quantity = 1;
      const imageMatch = card.innerHTML.match(/img-([a-zA-Z0-9_-]+)/);
      const imageClass = imageMatch ? imageMatch[1] : '';
      let image = 'assets/hero_donut_drip_1773499257269-removebg-preview.png';
      if (imageClass === 'chocolate') image = 'assets/donut_chocolate_1773498866336-removebg-preview.png';
      else if (imageClass === 'matcha') image = 'assets/donut-base.png';

      let cart = [];
      try {
        const parsed = JSON.parse(localStorage.getItem('donutCart'));
        if (Array.isArray(parsed)) cart = parsed;
      } catch (e) {
        console.error(e);
      }
      const existingItem = cart.find(item => item.name === name);
      
      if (existingItem) {
          existingItem.quantity += quantity;
      } else {
          cart.push({ name, price, quantity, image, filter: 'none' });
      }
      
      localStorage.setItem('donutCart', JSON.stringify(cart));

      const originalText = this.innerHTML;
      this.textContent = 'Added!';
      this.style.backgroundColor = '#4CAF50';
      
      updateBadge();

      setTimeout(() => {
          this.innerHTML = originalText;
          this.style.backgroundColor = '';
      }, 1000);
    });
  });

})();
