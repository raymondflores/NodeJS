const path = require('path');
const rootDir = require('../util/path');

const express = require('express');
const router = express.Router();

const products = [];

router.get('/add-product', (req, res) => {
  res.render('add-product', {
    title: 'Add Product',
    path: '/admin/add-product',
    formsCSS: true,
    productsCSS: true,
    activeAddProduct: true
  });
});

router.post('/add-product', (req, res) => {
  products.push({ title: req.body.title });
  res.redirect('/');
});

exports.routes = router;
exports.products = products;
