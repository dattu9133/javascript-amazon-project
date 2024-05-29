const cart = [];

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

  document.querySelector('.js-cart-quantity')
    .innerHTML = cartQuantity;
}