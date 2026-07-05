/**
 * AURA Clothing Website JS
 * Cart Drawer state management & Product category filter
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ---- MOBILE NAV TOGGLING ---- */
  const menuBtn = document.getElementById('menuBtn');
  const navlinks = document.getElementById('navlinks');

  if (menuBtn && navlinks) {
    menuBtn.addEventListener('click', () => {
      navlinks.classList.toggle('open');
      menuBtn.classList.toggle('open');
      // Toggle burger menu animation
      const spans = menuBtn.querySelectorAll('span');
      if (navlinks.classList.contains('open')) {
        spans[0].style.transform = 'translateY(7px) rotate(45deg)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
      } else {
        spans[0].style.transform = '';
        spans[1].style.opacity = '';
        spans[2].style.transform = '';
      }
    });

    // Close when clicking links
    navlinks.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        navlinks.classList.remove('open');
        const spans = menuBtn.querySelectorAll('span');
        spans[0].style.transform = '';
        spans[1].style.opacity = '';
        spans[2].style.transform = '';
      });
    });
  }

  /* ---- CATEGORY FILTERING ---- */
  const filterTabs = document.querySelectorAll('.filter-tab');
  const productCards = document.querySelectorAll('.product-card');

  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Toggle active states
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.getAttribute('data-filter');

      productCards.forEach(card => {
        const cat = card.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          card.classList.remove('hide');
        } else {
          card.classList.add('hide');
        }
      });
    });
  });

  /* ---- CART SYSTEM ---- */
  const cartDrawer = document.getElementById('cartDrawer');
  const cartBtn = document.getElementById('cartBtn');
  const cartCloseBtn = document.getElementById('cartCloseBtn');
  const cartOverlay = document.getElementById('cartOverlay');
  const cartItemsContainer = document.getElementById('cartItemsContainer');
  const cartCount = document.getElementById('cartCount');
  const cartSubtotal = document.getElementById('cartSubtotal');
  const checkoutBtn = document.getElementById('checkoutBtn');

  let cart = [];

  // Toggle drawer open
  const openCart = () => cartDrawer.classList.add('open');
  // Toggle drawer close
  const closeCart = () => cartDrawer.classList.remove('open');

  cartBtn?.addEventListener('click', openCart);
  cartCloseBtn?.addEventListener('click', closeCart);
  cartOverlay?.addEventListener('click', closeCart);

  // Render cart elements
  function updateCartUI() {
    // Total count of items
    const totalQty = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (cartCount) cartCount.textContent = totalQty;

    // Subtotal calculation
    const subtotalVal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    if (cartSubtotal) cartSubtotal.textContent = `$${subtotalVal.toFixed(2)}`;

    // Build items DOM
    if (!cartItemsContainer) return;
    cartItemsContainer.innerHTML = '';

    if (cart.length === 0) {
      cartItemsContainer.innerHTML = `
        <div style="text-align:center;padding:40px 0;color:var(--muted);font-size:0.85rem;font-family:'JetBrains Mono',monospace;">
          YOUR BAG IS CURRENTLY EMPTY
        </div>
      `;
      return;
    }

    cart.forEach(item => {
      const itemEl = document.createElement('div');
      itemEl.className = 'cart-item';
      
      // Select visual preview based on type
      let itemVisual = '';
      if (item.img === 'high') {
        itemVisual = `<path d="M15 20 C18 12, 32 12, 35 20 L38 45 L12 45 Z" fill="#2d2824"/>`;
      } else if (item.img === 'silk') {
        itemVisual = `<path d="M15 15 L35 15 L37 48 L13 48 Z" fill="#363d4a"/>`;
      } else if (item.img === 'denim') {
        itemVisual = `<path d="M12 18 L20 15 L25 18 L30 15 L38 18 L35 42 L15 42 Z" fill="#58677a"/>`;
      } else if (item.img === 'socks') {
        itemVisual = `<rect x="20" y="15" width="10" height="30" rx="2" fill="#a89a87"/>`;
      } else {
        itemVisual = `<rect x="15" y="15" width="20" height="25" fill="#695f57"/>`;
      }

      itemEl.innerHTML = `
        <div class="cart-item-img">
          <svg width="40" height="48" viewBox="0 0 50 60" xmlns="http://www.w3.org/2000/svg">
            <rect width="50" height="60" fill="#24211d"/>
            ${itemVisual}
          </svg>
        </div>
        <div class="cart-item-details">
          <h4>${item.name}</h4>
          <span class="price">$${item.price.toFixed(2)}</span>
        </div>
        <div class="cart-item-qty">
          <button class="qty-btn minus" data-id="${item.id}">-</button>
          <span class="qty-val">${item.quantity}</span>
          <button class="qty-btn plus" data-id="${item.id}">+</button>
        </div>
        <button class="cart-item-remove" data-id="${item.id}" aria-label="Remove item">
          <i class="fa-solid fa-trash-can"></i>
        </button>
      `;
      cartItemsContainer.appendChild(itemEl);
    });

    // Attach listeners inside the dynamic cart elements
    cartItemsContainer.querySelectorAll('.qty-btn.plus').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = parseInt(btn.getAttribute('data-id'));
        changeQty(id, 1);
      });
    });

    cartItemsContainer.querySelectorAll('.qty-btn.minus').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = parseInt(btn.getAttribute('data-id'));
        changeQty(id, -1);
      });
    });

    cartItemsContainer.querySelectorAll('.cart-item-remove').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = parseInt(btn.getAttribute('data-id'));
        removeFromCart(id);
      });
    });
  }

  // Edit quantity helper
  function changeQty(id, change) {
    const item = cart.find(i => i.id === id);
    if (!item) return;
    item.quantity += change;
    if (item.quantity <= 0) {
      removeFromCart(id);
    } else {
      updateCartUI();
    }
  }

  // Remove helper
  function removeFromCart(id) {
    cart = cart.filter(i => i.id !== id);
    updateCartUI();
  }

  // Add to cart helper
  document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = parseInt(btn.getAttribute('data-id'));
      const name = btn.getAttribute('data-name');
      const price = parseFloat(btn.getAttribute('data-price'));
      const img = btn.getAttribute('data-img');

      // Check if already in cart
      const existing = cart.find(item => item.id === id);
      if (existing) {
        existing.quantity += 1;
      } else {
        cart.push({ id, name, price, img, quantity: 1 });
      }

      updateCartUI();
      openCart();
    });
  });

  // Simulated Checkout trigger
  checkoutBtn?.addEventListener('click', () => {
    if (cart.length === 0) return;
    alert('Thank you for shopping! Checkout simulation completed successfully.');
    cart = [];
    updateCartUI();
    closeCart();
  });

  // Initialize view
  updateCartUI();
});
