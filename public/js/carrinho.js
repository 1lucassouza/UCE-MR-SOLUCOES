const CART_STORAGE_KEY = 'mrsolucoes_cart';

function parsePrice(value) {
  return Number(value.replace(/[^0-9,\.]/g, '').replace(',', '.')) || 0;
}

function formatPrice(value) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

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

function createCartItemRow(item) {
  const row = document.createElement('article');
  row.className = 'cart-item-row';
  row.dataset.id = item.id;
  row.innerHTML = `
    <div class="item-product">
      <img src="${item.image}" alt="${item.name}" />
      <div>
        <strong>${item.name}</strong>
        <p>${item.description}</p>
        <a href="#" class="remove-item">Remover</a>
      </div>
    </div>
    <div class="item-quantity">
      <button type="button" class="quantity-btn">-</button>
      <span>${item.quantity}</span>
      <button type="button" class="quantity-btn">+</button>
    </div>
    <div class="item-price">${formatPrice(item.price)}</div>
    <div class="item-total">${formatPrice(item.price * item.quantity)}</div>
  `;
  return row;
}

function renderCartItems() {
  const cartList = document.querySelector('.cart-items-list');
  const cartItems = getCartItems();
  cartList.innerHTML = '';

  if (cartItems.length === 0) {
    cartList.innerHTML = '<p class="empty-cart">O carrinho está vazio. Adicione produtos na página de produtos.</p>';
    return;
  }

  cartItems.forEach(item => {
    cartList.appendChild(createCartItemRow(item));
  });
}

function updateTotals() {
  const cartItems = getCartItems();
  let subtotal = 0;
  let itemCount = 0;

  cartItems.forEach(item => {
    subtotal += item.price * item.quantity;
    itemCount += item.quantity;
  });

  const subtotalEl = document.querySelector('.summary-row strong');
  const totalEl = document.querySelector('.summary-total strong');
  const cartCount = document.querySelector('.cart-title span');
  const freteValue = parsePrice(document.querySelector('.frete-value').textContent);
  const discountRow = document.querySelector('.coupon-discount strong');
  const discountValue = discountRow ? parsePrice(discountRow.textContent) : 0;

  subtotalEl.textContent = formatPrice(subtotal);
  totalEl.textContent = formatPrice(subtotal + freteValue - discountValue);
  cartCount.textContent = `(${itemCount} itens)`;
}

function updateCartItemQuantity(itemId, delta) {
  const cartItems = getCartItems();
  const item = cartItems.find(product => product.id === itemId);
  if (!item) return;

  item.quantity = Math.max(1, item.quantity + delta);
  saveCartItems(cartItems);
  renderCartItems();
  updateTotals();
}

function removeCartItem(itemId) {
  const cartItems = getCartItems().filter(item => item.id !== itemId);
  saveCartItems(cartItems);
  renderCartItems();
  updateTotals();
}

function applyCoupon() {
  const couponInput = document.querySelector('#cupom');
  const coupon = couponInput.value.trim().toUpperCase();
  const discountRow = document.querySelector('.coupon-discount');

  if (discountRow) {
    discountRow.remove();
  }

  if (coupon === 'MR10') {
    const subtotal = parsePrice(document.querySelector('.summary-row strong').textContent);
    const discount = subtotal * 0.1;
    const discountElement = document.createElement('div');
    discountElement.className = 'summary-row coupon-discount';
    discountElement.innerHTML = `<span>Desconto</span><strong>-${formatPrice(discount)}</strong>`;
    const summaryCard = document.querySelector('.summary-card');
    const totalRow = summaryCard.querySelector('.summary-total');
    summaryCard.insertBefore(discountElement, totalRow);
  }

  updateTotals();
}

function calculateFrete() {
  const cep = document.querySelector('#cep').value.trim();
  const freteValueEl = document.querySelector('.frete-value');

  if (/^\d{5}-?\d{3}$/.test(cep)) {
    freteValueEl.textContent = formatPrice(28);
  } else {
    freteValueEl.textContent = formatPrice(0);
  }

  updateTotals();
}

function initCart() {
  renderCartItems();
  updateTotals();

  document.querySelector('.cart-items-list').addEventListener('click', event => {
    if (event.target.classList.contains('quantity-btn')) {
      const row = event.target.closest('.cart-item-row');
      const itemId = row.dataset.id;
      updateCartItemQuantity(itemId, event.target.textContent.trim() === '+' ? 1 : -1);
    }

    if (event.target.classList.contains('remove-item')) {
      event.preventDefault();
      const row = event.target.closest('.cart-item-row');
      const itemId = row.dataset.id;
      removeCartItem(itemId);
    }
  });

  const applyButton = document.querySelector('.coupon-row button');
  if (applyButton) {
    applyButton.addEventListener('click', applyCoupon);
  }

  const freteButton = document.querySelector('.frete-row button');
  if (freteButton) {
    freteButton.addEventListener('click', calculateFrete);
  }

  const continueButton = document.querySelector('.btn-secondary');
  if (continueButton) {
    continueButton.addEventListener('click', () => {
      window.location.href = '/produtos';
    });
  }

  const checkoutButton = document.querySelector('.btn-primary');
  if (checkoutButton) {
    checkoutButton.addEventListener('click', () => {
      alert('Compra finalizada! Obrigado por comprar na MR Soluções.');
    });
  }
}

window.addEventListener('DOMContentLoaded', initCart);
