const fs = require('fs');
const path = require('path');

const rootDirectory = require('../util/path');
const p = path.join(rootDirectory, 'data', 'cart.json');

class Cart {
  static addProduct(id, productPrice) {
    fs.readFile(p, (err, fileContent) => {
      // fetch cart
      let cart = { products: [], totalPrice: 0 };
      if (!err) {
        cart = JSON.parse(fileContent);
      }

      // analyze cart
      const existingProductIndex = cart.products.findIndex(p => p.id === id);
      const existingProduct = cart.products[existingProductIndex];
      let updatedProduct;
      // add new product/increase qty
      if (existingProduct) {
        updatedProduct = {
          qty: existingProduct.qty++,
          ...existingProduct
        };
        cart.products = [...cart.products];
        cart.products[existingProductIndex] = updatedProduct;
      } else {
        updatedProduct = { id, qty: 1 };
        cart.products = [...cart.products, updatedProduct];
      }

      cart.totalPrice += +productPrice;
      fs.writeFile(p, JSON.stringify(cart), err => {
        console.log(err);
      });
    });
  }
}

module.exports = Cart;
