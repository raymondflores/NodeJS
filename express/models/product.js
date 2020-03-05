const fs = require('fs');
const path = require('path');
const rootDirectory = require('../util/path');

const products = [];
const p = path.join(rootDirectory, 'data', 'products.json');

const getProductsFromFile = cb => {
  fs.readFile(p, (err, fileContent) => {
    if (err) cb([]);
    cb(JSON.parse(fileContent));
  });
};

class Product {
  constructor(title, imageUrl, description, price) {
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  save() {
    getProductsFromFile(products => {
      products.push(this);
      fs.writeFile(p, JSON.stringify(products), err => {
        if (err) console.log(err);
      });
    });
  }

  static fetchAll(cb) {
    getProductsFromFile(cb);
  }
}

module.exports = Product;
