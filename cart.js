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

  const SHIPPING_FEE = 5.00;
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
          <img src="${item.image || 'Properties/hero_donut_drip_1773499257269-removebg-preview.png'}" 
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
          <div class="item-price">$${(item.price * item.quantity).toFixed(2)}</div>
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

    subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    taxEl.textContent = `$${tax.toFixed(2)}`;
    totalEl.textContent = `$${total.toFixed(2)}`;
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

})();
