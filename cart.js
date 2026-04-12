/* ═══════════════════════════════════════════════════════════════
   DonutCo Cart Logic
   ═══════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  let cart = JSON.parse(localStorage.getItem('donutCart')) || [];

  const itemsContainer = document.getElementById('cart-items-container');
  const emptyState = document.getElementById('empty-cart-state');
  const cartCount = document.getElementById('cart-count');

  // Summary Elements
  const subtotalEl = document.getElementById('subtotal-price');
  const taxEl = document.getElementById('tax-price');
  const totalEl = document.getElementById('total-price');

  const SHIPPING_FEE = 1500.00;
  const TAX_RATE = 0.08;

  function init() {
    renderCart();
    updateHeaderCount();
  }

  function renderCart() {
    if (cart.length === 0) {
      itemsContainer.style.display = 'none';
      emptyState.style.display = 'block';
      updateSummary(0);
      return;
    }

    itemsContainer.style.display = 'block';
    emptyState.style.display = 'none';
    itemsContainer.innerHTML = '';

    cart.forEach((item, index) => {
      const itemEl = document.createElement('div');
      itemEl.className = 'cart-item';
      itemEl.innerHTML = `
        <div class="item-image">
          <img src="${item.image || 'assets/hero_donut_drip_1773499257269-removebg-preview.png'}" 
               alt="${item.name}" 
               style="filter: ${item.filter || 'none'}">
        </div>
        <div class="item-info">
          <h4>${item.name}</h4>
          <p>${item.desc || 'Artisanal Handcrafted Donut'}</p>
        </div>
        <div class="item-controls">
          <div class="qty-control">
            <button class="qty-btn" onclick="updateQty(${index}, -1)">-</button>
            <span class="qty-val">${item.quantity}</span>
            <button class="qty-btn" onclick="updateQty(${index}, 1)">+</button>
          </div>
          <div class="item-price">Rs. ${(item.price * item.quantity).toFixed(2)}</div>
          <button class="remove-item" onclick="removeItem(${index})" aria-label="Remove item">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 6h18m-2 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>
          </button>
        </div>
      `;
      itemsContainer.appendChild(itemEl);
    });

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    updateSummary(subtotal);
  }

  function updateSummary(subtotal) {
    const tax = subtotal * TAX_RATE;
    const total = subtotal > 0 ? subtotal + tax + SHIPPING_FEE : 0;

    subtotalEl.textContent = `Rs. ${subtotal.toFixed(2)}`;
    taxEl.textContent = `Rs. ${tax.toFixed(2)}`;
    totalEl.textContent = `Rs. ${total.toFixed(2)}`;
  }

  window.updateQty = function (index, delta) {
    cart[index].quantity += delta;
    if (cart[index].quantity < 1) cart[index].quantity = 1;
    saveCart();
    renderCart();
    updateHeaderCount();
  };

  window.removeItem = function (index) {
    // Add a small exit animation before removal
    const items = document.querySelectorAll('.cart-item');
    items[index].style.transform = 'translateX(100px)';
    items[index].style.opacity = '0';
    
    setTimeout(() => {
      cart.splice(index, 1);
      saveCart();
      renderCart();
      updateHeaderCount();
    }, 300);
  };

  function saveCart() {
    localStorage.setItem('donutCart', JSON.stringify(cart));
  }

  function updateHeaderCount() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (cartCount) cartCount.textContent = count;
  }
  init();

  // ── Premium Checkout Success Experience ──
  const checkoutBtn = document.getElementById('checkout-btn');

  // Inject styles once
  (function injectCheckoutStyles() {
    const style = document.createElement('style');
    style.textContent = `
      /* ── Checkout Overlay ── */
      #checkout-overlay {
        position: fixed; inset: 0; z-index: 9999;
        display: flex; align-items: center; justify-content: center;
        background: rgba(10, 0, 20, 0.75);
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
        opacity: 0; pointer-events: none;
        transition: opacity 0.4s ease;
      }
      #checkout-overlay.active { opacity: 1; pointer-events: all; }

      .co-panel {
        background: #fff;
        border-radius: 36px;
        padding: 3.5rem 3rem;
        text-align: center;
        max-width: 480px;
        width: 90%;
        box-shadow: 0 40px 120px rgba(0,0,0,0.35);
        transform: translateY(60px) scale(0.9);
        opacity: 0;
        transition: all 0.55s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        position: relative;
        overflow: hidden;
      }
      #checkout-overlay.active .co-panel { transform: translateY(0) scale(1); opacity: 1; }

      .co-panel::before {
        content: '';
        position: absolute; top: 0; left: 0; right: 0; height: 6px;
        background: linear-gradient(90deg, #E8007D, #ff66a3, #FFB6C1);
      }

      .co-icon-ring {
        width: 100px; height: 100px;
        border-radius: 50%;
        background: linear-gradient(135deg, #fff0f8, #ffe0ef);
        display: flex; align-items: center; justify-content: center;
        margin: 0 auto 1.75rem;
        font-size: 3rem;
        box-shadow: 0 0 0 12px rgba(232,0,125,0.08), 0 0 0 24px rgba(232,0,125,0.04);
        animation: pulseRing 2s infinite;
      }
      @keyframes pulseRing {
        0%, 100% { box-shadow: 0 0 0 12px rgba(232,0,125,0.08), 0 0 0 24px rgba(232,0,125,0.04); }
        50%       { box-shadow: 0 0 0 18px rgba(232,0,125,0.12), 0 0 0 34px rgba(232,0,125,0.06); }
      }

      .co-title {
        font-family: 'Outfit', sans-serif;
        font-size: 2.25rem; font-weight: 900;
        letter-spacing: -1.5px; margin-bottom: 0.5rem;
        background: linear-gradient(135deg, #E8007D, #ff66a3);
        -webkit-background-clip: text; -webkit-text-fill-color: transparent;
      }
      .co-subtitle { color: #888; font-size: 1rem; line-height: 1.7; margin-bottom: 2rem; }
      .co-eta {
        background: linear-gradient(135deg, #fff0f8, #ffe0ef);
        border-radius: 16px; padding: 1rem 1.5rem;
        display: flex; align-items: center; gap: 1rem;
        margin-bottom: 2rem; text-align: left;
      }
      .co-eta-icon { font-size: 1.75rem; flex-shrink: 0; }
      .co-eta-label { font-size: 0.8rem; color: #aaa; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
      .co-eta-value { font-weight: 800; font-size: 1.1rem; color: #1a1a1a; }

      .co-divider { border: none; border-top: 1px solid #f0f0f0; margin: 0 0 2rem; }

      .co-actions { display: flex; gap: 1rem; }
      .co-btn-primary {
        flex: 1; padding: 1rem; border-radius: 14px; border: none;
        background: linear-gradient(135deg, #E8007D, #ff66a3);
        color: #fff; font-weight: 800; font-size: 1rem; cursor: pointer;
        transition: all 0.2s; letter-spacing: 0.2px;
      }
      .co-btn-primary:hover { transform: scale(1.03); box-shadow: 0 8px 24px rgba(232,0,125,0.35); }
      .co-btn-secondary {
        padding: 1rem 1.5rem; border-radius: 14px;
        border: 2px solid #ebebeb; background: #fff;
        font-weight: 700; font-size: 1rem; cursor: pointer; transition: 0.2s;
      }
      .co-btn-secondary:hover { background: #f9f9f9; }

      /* ── Floating Particles ── */
      .co-particle {
        position: fixed; pointer-events: none; z-index: 10000;
        border-radius: 50%; animation: particleFall linear forwards;
      }
      @keyframes particleFall {
        0%   { transform: translateY(-10vh) rotate(0deg); opacity: 1; }
        100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  })();

  function launchPremiumParticles() {
    const colors = ['#E8007D', '#FF66A3', '#FFB6C1', '#FFFFFF', '#FF1493', '#FFF0F5', '#FFD700'];
    const shapes = ['🍩', '✨', '🎉', '💖', '⭐'];
    let count = 0;
    const MAX = 60;

    function spawnParticle() {
      if (count >= MAX) return;
      count++;

      const isEmoji = Math.random() < 0.25;
      const el = document.createElement('div');
      el.classList.add('co-particle');

      if (isEmoji) {
        el.style.cssText = `
          font-size: ${10 + Math.random() * 18}px;
          left: ${Math.random() * 100}vw;
          animation-duration: ${2.5 + Math.random() * 2}s;
          animation-delay: ${Math.random() * 1.5}s;
          background: none;
        `;
        el.textContent = shapes[Math.floor(Math.random() * shapes.length)];
      } else {
        const size = 6 + Math.random() * 12;
        el.style.cssText = `
          width: ${size}px; height: ${size}px;
          background: ${colors[Math.floor(Math.random() * colors.length)]};
          left: ${Math.random() * 100}vw;
          animation-duration: ${2 + Math.random() * 2.5}s;
          animation-delay: ${Math.random() * 1.5}s;
          opacity: 0.9;
        `;
      }

      document.body.appendChild(el);
      el.addEventListener('animationend', () => el.remove());
    }

    // Burst particles over 800ms
    const interval = setInterval(() => {
      spawnParticle();
      spawnParticle();
      if (count >= MAX) clearInterval(interval);
    }, 30);
  }

  function showCheckoutSuccess() {
    let overlay = document.getElementById('checkout-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'checkout-overlay';
      overlay.innerHTML = `
        <div class="co-panel">
          <div class="co-icon-ring">🍩</div>
          <div class="co-title">Order Confirmed!</div>
          <p class="co-subtitle">
            Your artisanal treats are being lovingly crafted right now.<br>
            Get ready for something magical.
          </p>
          <div class="co-eta">
            <div class="co-eta-icon">🚀</div>
            <div>
              <div class="co-eta-label">Estimated Delivery</div>
              <div class="co-eta-value">25 – 40 minutes</div>
            </div>
          </div>
          <hr class="co-divider" />
          <div class="co-actions">
            <button class="co-btn-secondary" id="co-track-btn">Track Order</button>
            <button class="co-btn-primary" id="co-browse-btn">Continue Shopping</button>
          </div>
        </div>
      `;
      document.body.appendChild(overlay);

      document.getElementById('co-browse-btn').addEventListener('click', () => {
        overlay.classList.remove('active');
        setTimeout(() => window.location.href = 'menu.html', 400);
      });
      document.getElementById('co-track-btn').addEventListener('click', () => {
        overlay.classList.remove('active');
        setTimeout(() => window.location.href = 'orders.html', 400);
      });
    }

    requestAnimationFrame(() => overlay.classList.add('active'));
    launchPremiumParticles();
  }

  function handleCheckout() {
    if (cart.length === 0) {
      // Shake the button instead of alert
      checkoutBtn.style.animation = 'none';
      checkoutBtn.offsetHeight; // reflow
      const shakeStyle = document.createElement('style');
      shakeStyle.textContent = `@keyframes shakeBtn{0%,100%{transform:translateX(0)}20%,60%{transform:translateX(-8px)}40%,80%{transform:translateX(8px)}}`;
      document.head.appendChild(shakeStyle);
      checkoutBtn.style.animation = 'shakeBtn 0.5s ease';
      checkoutBtn.addEventListener('animationend', () => { checkoutBtn.style.animation = ''; }, { once: true });
      return;
    }

    // Animate button
    const orig = checkoutBtn.innerHTML;
    checkoutBtn.innerHTML = `<span style="display:flex;align-items:center;gap:8px;justify-content:center">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="animation:spin 0.8s linear infinite"><path d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" stroke-dasharray="30" stroke-dashoffset="0"/></svg>
      Processing…
    </span>`;
    checkoutBtn.disabled = true;
    const spinStyle = document.createElement('style');
    spinStyle.textContent = `@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}`;
    document.head.appendChild(spinStyle);

    setTimeout(() => {
      cart = [];
      saveCart();
      renderCart();
      updateHeaderCount();
      checkoutBtn.innerHTML = orig;
      checkoutBtn.disabled = false;
      showCheckoutSuccess();
    }, 1800);
  }

  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', handleCheckout);
  }

})();
