const Product = require('../models/product');

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.findAll();
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
    const product = await Product.findByPk(productId);
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
    const products = await Product.findAll();
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
    const cart = await req.user.getCart();
    const products = await cart.getProducts();
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
    const cart = await req.user.getCart();
    const products = await cart.getProducts({ where: { id: productId } });
    let product = products[0];

    if (product) {
      const updatedQty = ++product.cartItem.quantity;
      await cart.addProduct(product, {
        through: { quantity: updatedQty }
      });
    } else {
      product = await Product.findByPk(productId);
      await cart.addProduct(product, { through: { quantity: 1 } });
    }

    res.redirect('/cart');
  } catch (err) {
    console.log(err);
  }
};

exports.postDeleteCartProduct = async (req, res) => {
  try {
    const { productId } = req.body;
    const cart = await req.user.getCart();
    const products = await cart.getProducts({ where: { id: productId } });
    const product = products[0];

    await product.cartItem.destroy();
    res.redirect('/cart');
  } catch (err) {
    console.log(err);
  }
};

exports.getOrders = async (req, res) => {
  try {
    const orders = await req.user.getOrders({ include: ['products'] });
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
    const cart = await req.user.getCart();
    const products = await cart.getProducts();
    const order = await req.user.createOrder();
    await order.addProducts(
      products.map(product => {
        product.orderItem = { quantity: product.cartItem.quantity };
        return product;
      })
    );
    await cart.setProducts(null);
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
