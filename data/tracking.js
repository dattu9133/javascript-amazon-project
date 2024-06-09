import { orders } from "./orders.js";
import { loadProductsFetch, products } from "./products.js";

async function loadTracking() {
  await loadProductsFetch();
  trackingHtml();
}

loadTracking();

function trackingHtml() {
  const url = new URL(window.location.href);
  const orderId = url.searchParams.get('orderId');
  const productId = url.searchParams.get('productId');

  let matchingProduct;
  let matchingOrder;

  orders.forEach(order => {
    if (order.id == orderId) {
      matchingOrder = order;
    }
  });

  matchingOrder.products.forEach(product => {
    if (productId == product.productId) {
      matchingProduct = product;
    }
  });

  let productMain;
  products.forEach(product => {
    if (product.id == matchingProduct.productId) {
      productMain = product;
    }
  });

  const date = new Date(matchingProduct.estimatedDeliveryTime);
  const options = { month: 'long', day: 'numeric' };
  const arriveDate = date.toLocaleDateString('en-US', options);

  const currentTime = new Date();
  const orderTime = new Date(matchingOrder.orderTime);
  const deliveryTime = new Date(matchingProduct.estimatedDeliveryTime);

  const timeElapsed = currentTime - orderTime;
  const totalTime = deliveryTime - orderTime;

  const progressPercentage = Math.floor((timeElapsed / totalTime) * 1000);

  document.querySelector('.main').innerHTML = `
    <div class="order-tracking">
      <a class="back-to-orders-link link-primary" href="orders.html">
        View all orders
      </a>

      <div class="delivery-date">
        Arriving on ${arriveDate}
      </div>

      <div class="product-info">
        ${productMain.name}
      </div>

      <div class="product-info">
        Quantity: ${matchingProduct.quantity}
      </div>

      <img class="product-image" src="${productMain.image}">

      <div class="progress-labels-container">
        <div class="progress-label">Preparing</div>
        <div class="progress-label">Shipped</div>
        <div class="progress-label">Delivered</div>
      </div>

      <div class="progress-bar-container">
        <div class="progress-bar"></div>
      </div>
    </div>`;

  // Apply the progress bar width
  console.log(progressPercentage);
  document.querySelector('.progress-bar').style.width = `${progressPercentage}%`;

  // Apply the "current-status" class to the appropriate progress label
  let labelName;
  if (progressPercentage > 0 && progressPercentage < 50) {
    labelName = 'Preparing';
  } else if (progressPercentage >= 50 && progressPercentage < 100) {
    labelName = 'Shipped';
  } else {
    labelName = 'Delivered';
  }

  document.querySelectorAll('.progress-label').forEach((label) => {
    if (label.innerHTML === labelName) {
      label.classList.add('current-status');
    }
  });
}
