const path = require('path');
const rootDir = require('../util/path');

const express = require('express');
const router = express.Router();
const admin = require('./admin');

router.get('/', (req, res, next) => {
  const { products } = admin;
  res.render('shop', { products, title: 'Shop' });
});

module.exports = router;
