import { loadProducts } from '../data/products.js';
import { renderOrder } from './checkout/orderSummary.js';
import { renderPayment } from './checkout/paymentSummary.js';
loadProducts(() => {
  renderOrder()
  renderPayment()
})
