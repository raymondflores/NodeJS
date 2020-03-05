const Product = require('../models/product');

exports.getProducts = (req, res) => {
  Product.fetchAll(products => {
    res.render('shop/product-list', {
      products,
      title: 'All Products',
      path: '/products'
    });
  });
};

exports.getIndex = (req, res) => {
  Product.fetchAll(products => {
    res.render('shop/index', {
      products,
      title: 'Shop',
      path: '/'
    });
  });
};

exports.getCart = (req, res) => {
  res.render('shop/cart', {
    path: '/cart',
    title: 'Your Cart'
  });
};

exports.getOrders = (req, res) => {
  res.render('shop/orders', {
    path: '/orders',
    title: 'Your Orders'
  });
};

exports.getCheckout = (req, res) => {
  res.render('shop/cart', {
    path: '/checkout',
    title: 'Checkout'
  });
};
