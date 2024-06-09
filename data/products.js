import { formatCurrency } from '../scripts/utils/money.js';

export function getProduct(productId) {
  let matchingProduct;

  products.forEach((product) => {
    if (product.id === productId) {
      matchingProduct = product;
    }
  });

  return matchingProduct;
}

class Product {
  id;
  image;
  name;
  rating;
  priceCents;

  constructor(productDetails) {
    this.id = productDetails.id;
    this.image = productDetails.image;
    this.name = productDetails.name;
    this.rating = productDetails.rating;
    this.priceCents = productDetails.priceCents;
  }

  getStarsUrl() {
    return `images/ratings/rating-${this.rating.stars * 10}.png`;
  }

  getPrice() {
    return `$${formatCurrency(this.priceCents)}`;
  }

  extraInfoHTML() {
    return '';
  }
}

class Clothing extends Product {
  sizeChartLink;

  constructor(productDetails) {
    super(productDetails);
    this.sizeChartLink = productDetails.sizeChartLink;
  }

  extraInfoHTML() {
    // super.extraInfoHTML();
    return `
      <a href="${this.sizeChartLink}" target="_blank">
        Size chart
      </a>
    `;
  }
}

export let products = [];


export function loadProductsFetch() {
  const promise = fetch(
    'https://supersimplebackend.dev/products'
  )
    .then((response) => {
      // console.log(response)
      return response.json()
    })
    .then((productsData) => {
      // console.log(productsData)
      products = productsData.map((productDetails) => {
        if (productDetails.type === 'clothing') {
          return new Clothing(productDetails);
        }
        return new Product(productDetails);
      });
      // console.log(products)
      // console.log('Loaded Products')
    })
    .catch(() => {
      console.log("Unexcepted error.Try again!")
    })

  return promise
}

// export function loadProducts() {
//   const xhr = new XMLHttpRequest();

//   xhr.addEventListener('load', () => {
//     products = JSON.parse(xhr.response).map((productDetails) => {
//       if (productDetails.type === 'clothing') {
//         return new Clothing(productDetails);
//       }
//       return new Product(productDetails);
//     });

//     console.log('load products')
//
//   });

//   xhr.addEventListener('error', () => {
//     console.log("Unexcepted error.Try again!")
//   })
//   xhr.open('GET', 'https://supersimplebackend.dev/products');
//   xhr.send();
// }



