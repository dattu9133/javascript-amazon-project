export let cart = loadCart()

function loadCart() {
  let cart
  cart = JSON.parse(localStorage.getItem('cart'));
  if (!cart) {
    cart = [];
  }
  return cart
}

export function updateDeliveryId(productId, deliveryId) {
  let matchingItem;

  // console.log(productId, deliveryId)
  cart.forEach((cartItem) => {
    if (productId == cartItem.productId) {
      matchingItem = cartItem;
    }
  });
  matchingItem.deliveryId = deliveryId
  saveToStorage(cart)
  // console.log(cart)
}

export function updateCartQuantity() {
  let cartQuantity = 0;

  cart.forEach((cartItem) => {
    cartQuantity += cartItem.quantity;
  });

  document.querySelector('.cart-quantity')
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

export function loadCartItem(fun) {
  const xhr = new XMLHttpRequest();

  xhr.addEventListener('load', () => {
    console.log(xhr.response)
    fun();
  });

  xhr.open('GET', 'https://supersimplebackend.dev/cart');
  xhr.send();
}