const Product = require('../models/product');

exports.getAddProduct = (req, res) => {
  res.render('add-product', {
    title: 'Add Product',
    path: '/admin/add-product',
    formsCSS: true,
    productsCSS: true,
    activeAddProduct: true
  });
};

exports.postAddProduct = (req, res) => {
  const product = new Product(req.body.title);
  product.save();
  res.redirect('/');
};

exports.getProducts = (req, res) => {
  Product.fetchAll(products => {
    res.render('shop', {
      products,
      title: 'Shop',
      path: '/',
      hasProducts: products.length > 0,
      activeShop: true,
      productsCSS: true
    });
  });
};
