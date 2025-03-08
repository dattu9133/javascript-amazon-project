import { loadProductsFetch } from '../data/products.js';
import { renderOrder } from './checkout/orderSummary.js';
import { renderPayment } from './checkout/paymentSummary.js';
import { loadCartItem, cart } from '../data/cart.js';
import { addOrder } from '../data/orders.js';

// Promise.all([
//   loadProductsFetch(),
//   new Promise((resolve) => {
//     loadCartItem(() => {
//       resolve()
//     })
//   })
// ]).then(() => {
//   renderOrder()
//   renderPayment()
// })

function loadPage(fun) {
  fun()
}

loadProductsFetch().then(() => {
  new Promise((resolve) => {
    loadCartItem(() => {
      resolve()
    })
  })
    .then(() => {
      new Promise((resolve) => {
        loadPage(() => {
          resolve()
        });
      })
        .then(() => {
          renderOrder()
          renderPayment()
        })
    })
})

// loadProducts(() => {
//   loadCartItem(() => {
//     renderOrder()
//     renderPayment()
//   })
// })


document.querySelector('.js-place-order')
  .addEventListener('click', async () => {
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
  });