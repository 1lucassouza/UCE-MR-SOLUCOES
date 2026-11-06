const CART_STORAGE_KEY = 'mrsolucoes_cart';

function getCartItems() {
  try {
    return JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveCartItems(items) {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
}

function addToCart(item) {
  const cart = getCartItems();
  const existing = cart.find(product => product.id === item.id);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...item, quantity: 1 });
  }
  saveCartItems(cart);
  updateCartCount();
  alert(`${item.name} adicionado ao carrinho.`);
}

function calculateCartCount() {
  return getCartItems().reduce((count, item) => count + item.quantity, 0);
}

function updateCartCount() {
  const cartIcon = document.querySelector('.cart-icon');
  if (!cartIcon) return;
  const count = calculateCartCount();
  cartIcon.dataset.count = count;
}

function handleAddCartClick(event) {
  const button = event.target.closest('.add-cart');
  if (!button) return;

  const item = {
    id: button.dataset.id,
    name: button.dataset.name,
    price: parseFloat(button.dataset.price),
    image: button.dataset.image,
    description: button.dataset.desc || '',
  };

  addToCart(item);
}

function initProductsPage() {
  document.querySelectorAll('.add-cart').forEach(button => {
    button.addEventListener('click', handleAddCartClick);
  });
  updateCartCount();
}

window.addEventListener('DOMContentLoaded', initProductsPage);
