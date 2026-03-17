document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    // Tab Switching
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all
            tabs.forEach(t => t.classList.remove('active'));
            // Add to clicked
            tab.classList.add('active');
        });
    });

    // Quantity Selectors logic
    const qtySelectors = document.querySelectorAll('.qty-selector');
    
    qtySelectors.forEach(selector => {
        const minusBtn = selector.querySelector('.qty-btn.minus');
        const plusBtn = selector.querySelector('.qty-btn.plus');
        const qtyNum = selector.querySelector('.qty-num');

        if (minusBtn && plusBtn && qtyNum) {
            let quantity = parseInt(qtyNum.textContent);

            minusBtn.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent card from simulating click
                if (quantity > 1) {
                    quantity--;
                    qtyNum.textContent = quantity;
                    triggerPop(qtyNum);
                }
            });

            plusBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                quantity++;
                qtyNum.textContent = quantity;
                triggerPop(qtyNum);
            });
        }
    });

    function triggerPop(element) {
        element.classList.add('animate-pop');
        setTimeout(() => element.classList.remove('animate-pop'), 300);
    }

    // Add to Cart Animation
    const addBtns = document.querySelectorAll('.add-btn, .add-to-cart-btn');
    const cartIcon = document.querySelector('.cart-btn');

    addBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const card = this.closest('.product-card');
            const name = card.querySelector('.product-name').textContent;
            const price = parseFloat(card.querySelector('.price').textContent.replace('$', ''));
            const quantity = parseInt(card.querySelector('.qty-num').textContent);
            const image = card.dataset.image || '';
            const filter = card.dataset.filter || 'none';

            // Update localStorage
            let cart = JSON.parse(localStorage.getItem('donutCart')) || [];
            const existingItem = cart.find(item => item.name === name);
            
            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                cart.push({ name, price, quantity, image, filter });
            }
            
            localStorage.setItem('donutCart', JSON.stringify(cart));

            const isFeatured = this.classList.contains('add-to-cart-btn');
            const originalText = this.innerHTML;
            
            // Visual feedback on button
            if (isFeatured) {
                this.textContent = 'Added!';
            } else {
                this.innerHTML = '&#10003;'; // Checkmark
            }
            
            this.style.backgroundColor = '#4CAF50'; // Success Green
            
            // Pop the cart icon
            if (cartIcon) {
                cartIcon.classList.add('animate-pop');
                cartIcon.style.color = 'var(--primary-pink)';
                
                // Update badge if it exists
                const badge = cartIcon.querySelector('.cart-badge');
                if (badge) {
                    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
                    badge.textContent = totalItems;
                }
            }
            
            // Revert after 1 second
            setTimeout(() => {
                this.innerHTML = originalText;
                this.style.backgroundColor = '';
                if (cartIcon) {
                    cartIcon.classList.remove('animate-pop');
                    cartIcon.style.color = '';
                }
            }, 1000);
        });
    });

    // Initialize badge on load
    const cart = JSON.parse(localStorage.getItem('donutCart')) || [];
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const badge = document.querySelector('.cart-badge');
    if (badge) badge.textContent = totalItems;
});
