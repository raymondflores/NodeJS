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

  static deleteProduct(id, price) {
    fs.readFile(p, (err, fileContent) => {
      if (err) return;
      let cart = JSON.parse(fileContent);
      const product = cart.products.find(p => p.id === id);
      if (product) {
        // found in cart
        cart.products = cart.products.filter(p => p.id !== id);
        cart.totalPrice -= price * product.qty;
        fs.writeFile(p, JSON.stringify(cart), err => {
          console.log(err);
        });
      }
    });
  }

  static getCart(cb) {
    fs.readFile(p, (err, fileContent) => {
      const cart = JSON.parse(fileContent);
      if (err) cb(null);
      cb(cart);
    });
  }
}

module.exports = Cart;
