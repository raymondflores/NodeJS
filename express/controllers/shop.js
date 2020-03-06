const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getProducts = (req, res) => {
  Product.fetchAll(products => {
    res.render('shop/product-list', {
      products,
      title: 'All Products',
      path: '/products'
    });
  });
};

exports.getProduct = (req, res) => {
  const { productId } = req.params;
  Product.findById(productId, product => {
    res.render('shop/product-detail', {
      product,
      title: product.title,
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

exports.postCart = (req, res) => {
  const { productId } = req.body;
  Product.findById(productId, product => {
    Cart.addProduct(productId, product.price);
  });
  res.redirect('/cart');
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
