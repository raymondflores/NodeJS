const Product = require('../models/product');
const Order = require('../models/order');

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find();
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
    const products = await Product.find();
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
    const user = await req.user.populate('cart.items.productId').execPopulate();
    res.render('shop/cart', {
      path: '/cart',
      title: 'Your Cart',
      products: user.cart.items
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
    await req.user.removeFromCart(productId);
    res.redirect('/cart');
  } catch (err) {
    console.log(err);
  }
};

exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ 'user.userId': req.user._id });
    console.log(orders);
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
    const user = await req.user.populate('cart.items.productId').execPopulate();
    const products = user.cart.items.map(item => ({
      product: { ...item.productId._doc },
      quantity: item.quantity
    }));
    const order = new Order({
      user: {
        email: req.user.email,
        userId: req.user
      },
      products
    });
    await order.save();
    await req.user.clearCart();
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
