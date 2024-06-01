export let cart = JSON.parse(localStorage.getItem('cart')) || [{
  productId: 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6',
  quantity: 2,
  deliveryId: 1
}, {
  productId: '15b6fc6f-327a-4ec4-896f-486349e85a3d',
  quantity: 1,
  deliveryId: 2
}];;

if (!cart) {
  cart = [{
    productId: 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6',
    quantity: 2,
    deliveryId: 1
  }, {
    productId: '15b6fc6f-327a-4ec4-896f-486349e85a3d',
    quantity: 1,
    deliveryId: 2
  }];
}



export function updateCartQuantity() {
  let cartQuantity = 0;

  cart.forEach((cartItem) => {
    cartQuantity += cartItem.quantity;
  });

  document.querySelector('.js-cart-quantity')
    .innerHTML = cartQuantity;
  // document.querySelector('.return-to-home-link').innerHTML = `${cart.length} items`
}

export function saveToStorage(cart) {
  localStorage.setItem('cart', JSON.stringify(cart));
}

export function addToCart(productId) {
  let matchingItem;

  document.querySelector(`.added-to-cart-${productId}`).style.opacity = 1

  setTimeout(() => {
    document.querySelector(`.added-to-cart-${productId}`).style.opacity = 0
  }, 2000);

  let quantity = Number(document.querySelector(`#product-quantity-${productId}`).value) || 1


  cart.forEach((cartItem) => {
    if (productId === cartItem.productId) {
      matchingItem = cartItem;
    }
  });

  if (matchingItem) {
    matchingItem.quantity += quantity;
  } else {
    cart.push({
      productId,
      quantity,
      deliveryId: '1'
    });
  }

  saveToStorage(cart);
  updateCartQuantity()
}

export function removeFromCart(productId) {
  const newCart = [];

  cart.forEach((cartItem) => {
    if (cartItem.productId !== productId) {
      newCart.push(cartItem);
    }
  });

  cart = newCart;
  saveToStorage(cart);
}
