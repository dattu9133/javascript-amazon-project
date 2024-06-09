import { products, loadProductsFetch } from './products.js'
import { formatCurrency } from '../scripts/utils/money.js';
import { updateCartQuantity } from './cart.js'
export const orders = JSON.parse(localStorage.getItem('orders')) || [];

export function addOrder(order) {
  // console.log(order);
  orders.unshift(order);
  saveToStorage();
}

function renderOrderGrid() {
  let orderHtml = ''
  updateCartQuantity()
  // console.log(orders);
  orders.forEach(item => {
    // console.log(item);
    const date = new Date(item.orderTime);
    const options = { month: 'long', day: 'numeric' };
    const orderDate = date.toLocaleDateString('en-US', options);
    orderHtml += ` 
    <div class="order-container">
      <div class="order-header">
        <div class="order-header-left-section">
          <div class="order-date">
            <div class="order-header-label">Order Placed:</div>
            <div>${orderDate}</div>
          </div>
          <div class="order-total">
            <div class="order-header-label">Total:</div>
            <div>$${formatCurrency(item.totalCostCents)}</div>
          </div>
        </div>

        <div class="order-header-right-section">
          <div class="order-header-label">Order ID:</div>
          <div>${item.id}</div>
        </div>
      </div>`
    item.products.forEach((product) => {
      // console.log(product);
      const productId = product.productId;
      const matchingProduct = products.find(product => product.id === productId);
      // console.log(matchingProduct);
      const date = new Date(product.estimatedDeliveryTime);
      const options = { month: 'long', day: 'numeric' };
      const arriveDate = date.toLocaleDateString('en-US', options);
      orderHtml += `
        <div class="order-details-grid">
          <div class="product-image-container">
            <img src="${matchingProduct.image}">
          </div>

          <div class="product-details">
            <div class="product-name">
              ${matchingProduct.name}
            </div>
            <div class="product-delivery-date">
              Arriving on: ${arriveDate}
            </div>
            <div class="product-quantity">
              Quantity: ${product.quantity}
            </div>
            <button class="buy-again-button js-buy-again-button button-primary" data-product-id="${productId}" >
              <img class="buy-again-icon" src="images/icons/buy-again.png">
              <span class="buy-again-message">Buy it again</span>
            </button>
          </div>

          <div class="product-actions" data-product-id="${productId}" data-order-id="${item.id}">
            <a href="tracking.html">
              <button class="track-package-button button-secondary">
                Track package
              </button>
            </a>
          </div>
        </div>`
    })
    orderHtml += '</div>'
    // document.querySelector('.orders-grid').innerHTML = ;
  });

  document.querySelector('.orders-grid').innerHTML = orderHtml;
  // console.log(document.querySelectorAll('.buy-again-button').length);
  document.querySelectorAll('.js-buy-again-button')
    .forEach((button) => {
      button.addEventListener('click', () => {
        const { productId } = button.dataset;
        // console.log(productId);
        addOrderList(productId);
      });
    });

  document.querySelectorAll('.product-actions').forEach(container => {
    const productId = container.dataset.productId
    const orderId = container.dataset.orderId
    container.addEventListener('click', (event) => {
      event.preventDefault();
      const anchor = container.getElementsByTagName('a')[0];
      anchor.href = `tracking.html?orderId=${orderId}&productId=${productId}`;
      window.location.href = anchor.href;
    });
  });

}




async function addOrderList(productId) {
  const cart = []
  cart.push({
    productId,
    quantity: 1,
    deliveryId: '1'
  });
  try {
    const response = await fetch('https://supersimplebackend.dev/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        cart: cart
      })
    });
    localStorage.removeItem('cart')
    const order = await response.json();
    addOrder(order);

  } catch (error) {
    console.log('Unexpected error. Try again later.');
  }

  window.location.href = 'orders.html';
}


async function loadPage() {
  // console.log('Loaded Page')
  await loadProductsFetch();
  renderOrderGrid()
}
loadPage()

function saveToStorage() {
  localStorage.setItem('orders', JSON.stringify(orders));
  // console.log(JSON.parse(localStorage.getItem('orders')));
}

