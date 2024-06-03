import { cart, removeFromCart, saveToStorage, updateDeliveryId, removeCart } from '../data/cart.js';
import { products } from '../data/products.js';
import { formatCurrency } from './utils/money.js';
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js'
import { deliveryOptions } from '../data/deliveryOptions.js';

removeCart()

let cartSummaryHTML = '';
function updateCheckOutItems() {
  let checkOutItems = 0

  cart.forEach((item) =>
    checkOutItems += item.quantity
  )

  document.querySelector('.return-to-home-link').innerHTML = `${checkOutItems} items`;
}

renderOrder()
updateCheckOutItems()

function deliveryHtml(matchingProduct, cartItem) {
  let html = '';
  deliveryOptions.forEach((option) => {
    const date = dayjs().add(option.days, 'days').format('dddd, MMMM D');
    const cost = option.priceCents === 0 ? 'FREE Shipping' : `$${formatCurrency(option.priceCents)} - Shipping`;

    html +=
      `<div class="delivery-option js-delivery-option" data-date='${date}' data-delivery-id='${option.id}' data-product-id='${matchingProduct.id}'">
        <input type="radio" ${cartItem.deliveryId == option.id ? 'checked' : ''} class="delivery-option-input delivery-option-input-${option.id}-${matchingProduct.id}" name="delivery-option-${matchingProduct.id}">
        <div>
          <div class="delivery-option-date">
            ${date}
          </div>
          <div class="delivery-option-price">
            ${cost}
          </div>
        </div>
      </div>`;
  });
  // if (cartItem.deliveryId == option.id) {
  //   document.querySelector(`.delivery-date-${matchingProduct.id}`).innerHTML = `Delivery date:${date} `
  // }
  return html;
}

function renderOrder() {
  cart.forEach((cartItem) => {
    const productId = cartItem.productId;
    const matchingProduct = products.find(product => product.id === productId);
    let deliveryDays = 0
    deliveryOptions.forEach((option) => {
      if (option.id == cartItem.deliveryId)
        deliveryDays = option.days
    })
    const date = dayjs().add(deliveryDays, 'day').format('dddd, MMMM D');

    cartSummaryHTML += `
    <div class="cart-item-container js-cart-item-container-${matchingProduct.id}">
      <div class="delivery-date delivery-date-${matchingProduct.id}">
        Delivery date: ${date}
      </div>
      <div class="cart-item-details-grid">
        <img class="product-image" src="${matchingProduct.image}">
        <div class="cart-item-details">
          <div class="product-name">
            ${matchingProduct.name}
          </div>
          <div class="product-price">
            $${formatCurrency(matchingProduct.priceCents)}
          </div>
          <div class="product-quantity">
            <span>
              Quantity: <span class="quantity-label">${cartItem.quantity}</span>
            </span>
            <span class="update-quantity-link js-update-link link-primary" data-product-id="${matchingProduct.id}">
              Update
            </span>
            <span class="delete-quantity-link link-primary js-delete-link" data-product-id="${matchingProduct.id}">
              Delete
            </span>
          </div>
        </div>
        <div class="delivery-options">
          <div class="delivery-options-title">
            Choose a delivery option:
          </div>
          ${deliveryHtml(matchingProduct, cartItem)}
          
        </div>
      </div>
    </div>
  `;
  });

  document.querySelector('.js-order-summary').innerHTML = cartSummaryHTML;
}

document.querySelectorAll('.js-delete-link').forEach((link) => {
  link.addEventListener('click', () => {
    const productId = link.dataset.productId;
    removeFromCart(productId);

    const container = document.querySelector(`.js-cart-item-container-${productId}`);
    container.remove();
    updateCheckOutItems()
  });
});

document.querySelectorAll('.update-quantity-link').forEach((link) => {
  link.addEventListener('click', (event) => {
    const productId = link.dataset.productId;
    const updateHTML = `
      <span class="save-quantity-link js-save-link link-primary" data-product-id="${productId}">
        Save
      </span>
    `;
    document.querySelector(`.js-cart-item-container-${productId} .quantity-label`).innerHTML = `<input type="number" min="0" max="1000" style="width: 50px; border-radius: 5px; border:1px solid orange;" class="quantity-input">`;
    link.innerHTML = updateHTML;

    link.querySelector('.save-quantity-link').addEventListener('click', (e) => {
      e.stopPropagation();
      update()
    });

    function update() {
      const newQuantity = document.querySelector(`.js-cart-item-container-${productId} .quantity-label .quantity-input`).value;

      const cartItem = cart.find(item => item.productId === productId);
      if (cartItem) {
        cartItem.quantity = Number(newQuantity);
        saveToStorage();
        console.log(cart)

        link.innerHTML = `<span class="update-quantity-link js-update-link link-primary" data-product-id="${productId}">
            Update
          </span>`;
        document.querySelector(`.js-cart-item-container-${productId} .quantity-label`).innerHTML = newQuantity;
        updateCheckOutItems()
      }
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        update()
      }
    });
  });
});

document.querySelectorAll('.js-delivery-option').forEach((button) =>
  button.addEventListener('click', () => {
    const { date, deliveryId, productId } = button.dataset
    const checkbox = document.querySelector(`.delivery-option-input-${deliveryId}-${productId}`)
    checkbox.checked = true;
    document.querySelector(`.delivery-date-${productId}`).innerHTML = `Delivery date:${date} `
    updateDeliveryId(productId, deliveryId)
  })
)