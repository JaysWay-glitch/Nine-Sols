// ── Nine Sols Cart Logic ──────────────────────────────────────────────────────

const CART_KEY = 'nineSolsCart';

function getCart() {
  try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; }
  catch { return []; }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartBadge();
}

function addToCart(name, price, imageClass) {
  const cart = getCart();
  const existing = cart.find(i => i.name === name);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ name, price, qty: 1, imageClass: imageClass || '' });
  }
  saveCart(cart);
  showToast(`${name} added to cart`);
}

function removeFromCart(name) {
  saveCart(getCart().filter(i => i.name !== name));
  if (typeof renderCart === 'function') renderCart();
}

function updateQty(name, delta) {
  const cart = getCart();
  const item = cart.find(i => i.name === name);
  if (!item) return;
  item.qty = Math.max(1, item.qty + delta);
  saveCart(cart);
  if (typeof renderCart === 'function') renderCart();
}

function cartTotal() {
  return getCart().reduce((sum, i) => sum + i.price * i.qty, 0);
}

function cartCount() {
  return getCart().reduce((sum, i) => sum + i.qty, 0);
}

function updateCartBadge() {
  const badge = document.querySelector('.cart-badge');
  if (!badge) return;
  const count = cartCount();
  badge.textContent = count;
  badge.style.display = count > 0 ? 'flex' : 'none';
}

// Toast notification
function showToast(msg) {
  let toast = document.getElementById('ns-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'ns-toast';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove('show'), 2400);
}

// Wire up all "Add to Cart" buttons on the page
function wireAddToCartButtons() {
  document.querySelectorAll('[data-product]').forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.product-card');
      const name = card.querySelector('.product-name').textContent;
      const priceStr = card.querySelector('.product-price').textContent.replace('$', '');
      const price = parseFloat(priceStr);
      const imgDiv = card.querySelector('.product-image');
      const imageClass = imgDiv ? imgDiv.className.replace('product-image', '').trim() : '';
      addToCart(name, price, imageClass);
    });
  });
}

// Mobile nav toggle
function initMobileMenu() {
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav-links');
  if (!toggle || !nav) return;
  toggle.addEventListener('click', () => {
    nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', nav.classList.contains('open'));
  });
}

document.addEventListener('DOMContentLoaded', () => {
  updateCartBadge();
  wireAddToCartButtons();
  initMobileMenu();
});
