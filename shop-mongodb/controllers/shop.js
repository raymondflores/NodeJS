const Product = require('../models/product');

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.fetchAll();
    res.render('shop/product-list', {
      products,
      title: 'All Products',
      path: '/products'
    });
  } catch (err) {
    console.log(err);
  }
};

exports.getProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await Product.findById(productId);
    res.render('shop/product-detail', {
      product,
      title: product.title,
      path: '/products'
    });
  } catch (err) {
    console.log(err);
  }
};

exports.getIndex = async (req, res) => {
  try {
    const products = await Product.fetchAll();
    res.render('shop/index', {
      products,
      title: 'Shop',
      path: '/'
    });
  } catch (err) {
    console.log(err);
  }
};

exports.getCart = async (req, res) => {
  try {
    const products = await req.user.getCart();
    res.render('shop/cart', {
      path: '/cart',
      title: 'Your Cart',
      products
    });
  } catch (err) {
    console.log(err);
  }
};

exports.postCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const product = await Product.findById(productId);
    await req.user.addToCart(product);
    res.redirect('/cart');
  } catch (err) {
    console.log(err);
  }
};

exports.postDeleteCartProduct = async (req, res) => {
  try {
    const { productId } = req.body;
    await req.user.deleteItemFromCart(productId);

    res.redirect('/cart');
  } catch (err) {
    console.log(err);
  }
};

exports.getOrders = async (req, res) => {
  try {
    const orders = await req.user.getOrders();
    res.render('shop/orders', {
      path: '/orders',
      title: 'Your Orders',
      orders
    });
  } catch (err) {
    console.log(err);
  }
};

exports.postOrder = async (req, res) => {
  try {
    await req.user.addOrder();
    res.redirect('/orders');
  } catch (err) {
    console.log(err);
  }
};

exports.getCheckout = (req, res) => {
  res.render('shop/cart', {
    path: '/checkout',
    title: 'Checkout'
  });
};
