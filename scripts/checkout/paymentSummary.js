import { cart } from "../../data/cart.js";
import { getDeliveryId } from "../../data/deliveryOptions.js";
import { getProduct } from "../../data/products.js";
import { updateCheckOutItems } from "./orderSummary.js";
import { formatCurrency } from "../utils/money.js";

export function renderPayment() {
  let productPrice = 0
  let shippingCost = 0;
  cart.forEach((item) => {
    const product = getProduct(item.productId)
    productPrice += item.quantity * product.priceCents
    shippingCost += getDeliveryId(item.deliveryId).priceCents
  });
  // console.log(productPrice, shippingCost)
  updateCheckOutItems()
  document.querySelector('.payment-summary-item-money').innerHTML = `$${formatCurrency(productPrice)}`
  document.querySelector('.payment-summary-shipping-money').innerHTML = `$${formatCurrency(shippingCost)}`
  document.querySelector('.payment-summary-bt-money').innerHTML = `$${formatCurrency(productPrice + shippingCost)}`
  document.querySelector('.payment-summary-at-money').innerHTML = `$${formatCurrency((productPrice + shippingCost) * 0.1)}`
  document.querySelector('.payment-summary-money').innerHTML = `$${formatCurrency((productPrice + shippingCost) / 10
    + productPrice + shippingCost)}`
}