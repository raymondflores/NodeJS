const path = require('path');
const rootDir = require('../util/path');

const express = require('express');
const router = express.Router();
const admin = require('./admin');

router.get('/', (req, res) => {
  const { products } = admin;

  res.render('shop', {
    products,
    title: 'Shop',
    path: '/',
    hasProducts: products.length > 0,
    activeShop: true,
    productsCSS: true
  });
});

module.exports = router;
