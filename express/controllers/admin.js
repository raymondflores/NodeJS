const Product = require('../models/product');

exports.getAddProduct = (req, res) => {
  res.render('admin/add-product', {
    title: 'Add Product',
    path: '/admin/add-product',
    formsCSS: true,
    productsCSS: true,
    activeAddProduct: true
  });
};

exports.postAddProduct = (req, res) => {
  const { title, imageUrl, description, price } = req.body;
  const product = new Product(title, imageUrl, description, price);
  product.save();
  res.redirect('/');
};

exports.getProducts = (req, res) => {
  Product.fetchAll(products => {
    res.render('admin/products', {
      products,
      title: 'Admin Products',
      path: '/admin/products'
    });
  });
};
