const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getProducts = async (req, res) => {
  try {
    const [products] = await Product.fetchAll();
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
    const [[product]] = await Product.findById(productId);
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
    const [products] = await Product.fetchAll();
    res.render('shop/index', {
      products,
      title: 'Shop',
      path: '/'
    });
  } catch (err) {
    console.log(err);
  }
};

exports.getCart = (req, res) => {
  Cart.getCart(cart => {
    Product.fetchAll(products => {
      const cartProducts = products
        .filter(p => cart.products.find(cp => cp.id === p.id))
        .map(p => {
          const product = cart.products.find(cp => cp.id === p.id);
          return { ...product, ...p };
        });
      res.render('shop/cart', {
        path: '/cart',
        title: 'Your Cart',
        products: cartProducts
      });
    });
  });
};

exports.postCart = (req, res) => {
  const { productId } = req.body;
  Product.findById(productId, product => {
    Cart.addProduct(productId, product.price);
  });
  res.redirect('/cart');
};

exports.postDeleteCartProduct = (req, res) => {
  const { productId } = req.body;
  Product.findById(productId, product => {
    Cart.deleteProduct(productId, product.price);
    res.redirect('/cart');
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
