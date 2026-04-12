/* ═══════════════════════════════════════════════════════════════
   DonutCo Profile.js — Shared logic for all profile-area pages
   ═══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  /* ── Cart Badge ── */
  function updateBadge() {
    const cart = JSON.parse(localStorage.getItem('donutCart')) || [];
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    const badge = document.getElementById('cart-count');
    if (badge) badge.textContent = count;
  }
  updateBadge();

  /* ── Logout Modal ── */
  function injectLogoutModal() {
    if (document.getElementById('logout-modal')) return;
    const modal = document.createElement('div');
    modal.id = 'logout-modal';
    modal.innerHTML = `
      <div class="logout-backdrop" id="logout-backdrop"></div>
      <div class="logout-dialog" role="dialog" aria-modal="true" aria-labelledby="logout-title">
        <div class="logout-icon">👋</div>
        <h2 id="logout-title">Leaving already?</h2>
        <p>You'll need to sign back in to track orders and access your rewards.</p>
        <div class="logout-actions">
          <button class="btn-stay" id="btn-stay">Stay Logged In</button>
          <button class="btn-confirm-logout" id="btn-confirm-logout">Yes, Logout</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    const style = document.createElement('style');
    style.textContent = `
      #logout-modal { position:fixed; inset:0; z-index:9999; display:flex; align-items:center; justify-content:center; }
      .logout-backdrop { position:absolute; inset:0; background:rgba(0,0,0,0.45); backdrop-filter:blur(4px); animation:fadeIn 0.2s; }
      .logout-dialog { position:relative; background:#fff; border-radius:28px; padding:3rem 2.5rem; text-align:center; max-width:420px; width:90%; box-shadow:0 32px 80px rgba(0,0,0,0.2); animation:slideUp 0.3s cubic-bezier(.175,.885,.32,1.275); }
      .logout-icon { font-size:3rem; margin-bottom:1rem; }
      .logout-dialog h2 { font-size:1.75rem; font-weight:900; margin-bottom:0.75rem; }
      .logout-dialog p { color:#888; margin-bottom:2rem; line-height:1.6; }
      .logout-actions { display:flex; gap:1rem; }
      .btn-stay { flex:1; padding:1rem; border-radius:14px; border:2px solid #ebebeb; background:#fff; font-weight:700; font-size:1rem; cursor:pointer; transition:all 0.2s; }
      .btn-stay:hover { background:#f5f5f5; }
      .btn-confirm-logout { flex:1; padding:1rem; border-radius:14px; border:none; background:linear-gradient(135deg,#ff4d4d,#ff1f1f); color:#fff; font-weight:700; font-size:1rem; cursor:pointer; transition:all 0.2s; }
      .btn-confirm-logout:hover { transform:scale(1.03); box-shadow:0 8px 20px rgba(255,60,60,0.35); }
      @keyframes fadeIn { from{opacity:0} to{opacity:1} }
      @keyframes slideUp { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }
    `;
    document.head.appendChild(style);

    document.getElementById('logout-backdrop').addEventListener('click', closeLogout);
    document.getElementById('btn-stay').addEventListener('click', closeLogout);
    document.getElementById('btn-confirm-logout').addEventListener('click', () => {
      localStorage.removeItem('donutUser');
      window.location.href = 'index.html';
    });
  }

  function openLogout() { injectLogoutModal(); document.getElementById('logout-modal').style.display = 'flex'; }
  function closeLogout() { const m = document.getElementById('logout-modal'); if (m) m.style.display = 'none'; }

  document.querySelectorAll('.pro-nav-item.logout, a.logout').forEach(el => {
    el.addEventListener('click', e => { e.preventDefault(); openLogout(); });
  });

  /* ── Edit Avatar ── */
  const editAvatarBtn = document.querySelector('.edit-avatar');
  const avatarImg    = document.querySelector('.user-avatar img');
  if (editAvatarBtn && avatarImg) {
    editAvatarBtn.title = 'Change avatar';
    editAvatarBtn.addEventListener('click', () => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = e => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = ev => {
          avatarImg.src = ev.target.result;
          showToast('Avatar updated!');
        };
        reader.readAsDataURL(file);
      };
      input.click();
    });
  }

  /* ── Reorder Last (Dashboard + Orders page) ── */
  document.querySelectorAll('.action-btn:not(.outline)').forEach(btn => {
    if (btn.textContent.trim() === 'Reorder Last') {
      btn.addEventListener('click', () => {
        // Add ORD-9921 items to cart
        let cart = JSON.parse(localStorage.getItem('donutCart')) || [];
        const reorderItems = [
          { name: 'Dozen Box', price: 8000, quantity: 1, image: 'assets/donut_box_dozen_1775983160540.png', filter: 'none' },
          { name: 'Iced Latte', price: 900, quantity: 2, image: 'assets/drink_iced_latte_1775983691589.png', filter: 'none' }
        ];
        reorderItems.forEach(newItem => {
          const existing = cart.find(i => i.name === newItem.name);
          if (existing) existing.quantity += newItem.quantity;
          else cart.push(newItem);
        });
        localStorage.setItem('donutCart', JSON.stringify(cart));
        updateBadge();
        showToast('Last order added to cart! 🍩');
      });
    }
  });

  /* ── Track Order ── */
  document.querySelectorAll('.action-btn.outline').forEach(btn => {
    if (btn.textContent.trim() === 'Track Order') {
      btn.addEventListener('click', () => openTrackingModal());
    }
  });

  function openTrackingModal() {
    if (document.getElementById('track-modal')) {
      document.getElementById('track-modal').style.display = 'flex';
      return;
    }
    const modal = document.createElement('div');
    modal.id = 'track-modal';
    modal.innerHTML = `
      <div class="logout-backdrop" id="track-backdrop"></div>
      <div class="logout-dialog" style="max-width:500px;">
        <div class="logout-icon">📦</div>
        <h2>Track Your Order</h2>
        <p style="margin-bottom:1.5rem;">Order <strong>#ORD-9921</strong> is on its way!</p>
        <div class="track-steps">
          <div class="track-step done"><div class="ts-dot"></div><span>Order Confirmed</span></div>
          <div class="track-step done"><div class="ts-dot"></div><span>Baking in Progress</span></div>
          <div class="track-step done"><div class="ts-dot"></div><span>Out for Delivery</span></div>
          <div class="track-step active"><div class="ts-dot"></div><span>Delivered ✓</span></div>
        </div>
        <button class="btn-stay" style="width:100%;margin-top:1.5rem;" id="btn-close-track">Close</button>
      </div>
    `;
    const style = document.createElement('style');
    style.textContent = `
      .track-steps { display:flex; flex-direction:column; gap:0; text-align:left; }
      .track-step { display:flex; align-items:center; gap:1rem; padding:0.75rem 0; position:relative; color:#aaa; font-weight:600; }
      .track-step:not(:last-child)::after { content:''; position:absolute; left:11px; top:calc(50% + 12px); width:2px; height:calc(100% - 12px); background:#eee; }
      .track-step.done::after { background:var(--magenta,#E8007D); }
      .ts-dot { width:24px; height:24px; border-radius:50%; border:2px solid #e0e0e0; flex-shrink:0; background:#fff; }
      .track-step.done .ts-dot { background:var(--magenta,#E8007D); border-color:var(--magenta,#E8007D); }
      .track-step.done { color:#333; }
      .track-step.active .ts-dot { box-shadow:0 0 0 5px rgba(232,0,125,0.15); }
    `;
    document.head.appendChild(style);
    document.body.appendChild(modal);
    document.getElementById('track-backdrop').addEventListener('click', () => modal.style.display = 'none');
    document.getElementById('btn-close-track').addEventListener('click', () => modal.style.display = 'none');
  }

  /* ── Order Details buttons (profile.html) ── */
  document.querySelectorAll('.btn-details').forEach((btn, i) => {
    const orderIds = ['9921', '9844'];
    btn.addEventListener('click', () => {
      window.location.href = `order-details.html?id=ORD-${orderIds[i] || '9921'}`;
    });
  });

  /* ── Profile: "View All" recent orders link ── */
  const viewAllLink = document.querySelector('.recent-orders .view-all');
  if (viewAllLink) viewAllLink.href = 'orders.html';

  /* ── Orders page: Reorder Box buttons ── */
  document.querySelectorAll('.btn-reorder').forEach((btn, i) => {
    const ordersData = [
      [{ name:'Dozen Box', price:8000, quantity:1, image:'assets/donut_box_dozen_1775983160540.png', filter:'none' }, { name:'Iced Latte', price:900, quantity:2, image:'assets/drink_iced_latte_1775983691589.png', filter:'none' }],
      [{ name:'Custom Gift Box', price:5000, quantity:1, image:'assets/donut_box_custom_1775983176322.png', filter:'none' }, { name:'Hot Mocha', price:1100, quantity:1, image:'assets/drink_hot_mocha_1775983710902.png', filter:'none' }],
      [{ name:'Strawberry Sprinkles', price:800, quantity:2, image:'assets/hero_donut_drip_1773499257269-removebg-preview.png', filter:'none' }, { name:'Matcha Delight', price:950, quantity:1, image:'assets/donut-base.png', filter:'hue-rotate(60deg) saturate(1.8)' }, { name:'Strawberry Smoothie', price:1200, quantity:1, image:'assets/drink_strawberry_smoothie_1775983760041.png', filter:'none' }],
    ];
    btn.addEventListener('click', () => {
      let cart = JSON.parse(localStorage.getItem('donutCart')) || [];
      const items = ordersData[i] || ordersData[0];
      items.forEach(newItem => {
        const existing = cart.find(c => c.name === newItem.name);
        if (existing) existing.quantity += newItem.quantity;
        else cart.push({...newItem});
      });
      localStorage.setItem('donutCart', JSON.stringify(cart));
      updateBadge();
      showToast('Items added to cart! 🛒');
    });
  });

  /* ── Order Details page buttons ── */
  const reorderFullBtn = document.querySelector('.btn-reorder-full');
  if (reorderFullBtn) {
    reorderFullBtn.addEventListener('click', () => {
      let cart = JSON.parse(localStorage.getItem('donutCart')) || [];
      const items = [
        { name:'Chocolate Boom', price:950, quantity:2, image:'assets/donut_chocolate_1773498866336-removebg-preview.png', filter:'none' },
        { name:'Dozen Box', price:8000, quantity:1, image:'assets/donut_box_dozen_1775983160540.png', filter:'none' }
      ];
      items.forEach(newItem => {
        const existing = cart.find(c => c.name === newItem.name);
        if (existing) existing.quantity += newItem.quantity;
        else cart.push(newItem);
      });
      localStorage.setItem('donutCart', JSON.stringify(cart));
      updateBadge();
      showToast('All items added to cart! Heading to checkout…');
      setTimeout(() => { window.location.href = 'cart.html'; }, 1500);
    });
  }

  const invoiceBtn = document.querySelector('.btn-invoice');
  if (invoiceBtn) {
    invoiceBtn.addEventListener('click', () => {
      showToast('Invoice downloaded! 📄');
    });
  }

  /* ── Wishlist: Remove buttons ── */
  document.querySelectorAll('.wishlist-remove').forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.wishlist-card');
      card.style.transition = 'all 0.3s ease';
      card.style.transform = 'scale(0.9)';
      card.style.opacity = '0';
      setTimeout(() => {
        card.remove();
        const remaining = document.querySelectorAll('.wishlist-card').length;
        if (remaining === 0) {
          const grid = document.querySelector('.wishlist-grid');
          if (grid) grid.innerHTML = `<div style="text-align:center;padding:4rem;grid-column:1/-1;color:#aaa;"><div style="font-size:3rem;">💔</div><h3 style="margin-top:1rem;">Your wishlist is empty</h3><a href="menu.html" style="color:var(--magenta);font-weight:700;">Browse Menu</a></div>`;
        }
        showToast('Removed from wishlist');
      }, 300);
    });
  });

  /* ── Wishlist: Add-to-cart buttons ── */
  document.querySelectorAll('.btn-add-cart').forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.wishlist-card');
      const name = card.querySelector('h3').textContent;
      const priceText = card.querySelector('.wishlist-price').textContent;
      const price = parseFloat(priceText.replace('Rs.','').trim());
      const img = card.querySelector('img');
      const image = img ? img.src : '';

      let cart = JSON.parse(localStorage.getItem('donutCart')) || [];
      const existing = cart.find(i => i.name === name);
      if (existing) existing.quantity++;
      else cart.push({ name, price, quantity:1, image, filter:'none' });
      localStorage.setItem('donutCart', JSON.stringify(cart));
      updateBadge();

      const orig = btn.innerHTML;
      btn.textContent = 'Added! ✓';
      btn.style.background = '#4CAF50';
      setTimeout(() => { btn.innerHTML = orig; btn.style.background = ''; }, 1500);
      showToast(`${name} added to cart!`);
    });
  });

  /* ── Toast notification ── */
  function showToast(msg) {
    let toast = document.getElementById('dc-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'dc-toast';
      const s = document.createElement('style');
      s.textContent = `
        #dc-toast { position:fixed; bottom:2rem; left:50%; transform:translateX(-50%) translateY(100px);
          background:#1a1a1a; color:#fff; padding:1rem 2rem; border-radius:50px;
          font-weight:600; font-size:0.95rem; z-index:9998; transition:all 0.4s cubic-bezier(.175,.885,.32,1.275);
          opacity:0; white-space:nowrap; box-shadow:0 8px 32px rgba(0,0,0,0.25); }
        #dc-toast.show { opacity:1; transform:translateX(-50%) translateY(0); }
      `;
      document.head.appendChild(s);
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toast._t);
    toast._t = setTimeout(() => toast.classList.remove('show'), 3000);
  }

})();
