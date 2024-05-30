export const cart = [{
  "productId": "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
  "quantity": 3
}, {
  "productId": "15b6fc6f-327a-4ec4-896f-486349e85a3d",
  "quantity": 2
}
];

export function updateCartQuantity(productId, quantity) {
  let matchingItem;

  document.querySelector(`.added-to-cart-${productId}`).style.opacity = 1;

  let timer = setTimeout(() => {
    document.querySelector(`.added-to-cart-${productId}`).style.opacity = 0;
  }, 2000);

  cart.forEach((item) => {
    if (productId === item.productId) {
      matchingItem = item;
    }
  });

  if (matchingItem) {
    matchingItem.quantity += quantity || 1;
  } else {
    cart.push({
      productId, quantity
    });
  }

  let cartQuantity = 0;

  cart.forEach((item) => {
    cartQuantity += item.quantity;
  });

  // console.log(cart)

  document.querySelector('.js-cart-quantity')
    .innerHTML = cartQuantity;
}