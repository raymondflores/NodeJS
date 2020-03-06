const Product = require('../models/product');

exports.getAddProduct = (req, res) => {
  res.render('admin/edit-product', {
    title: 'Add Product',
    path: '/admin/add-product',
    editing: false
  });
};

exports.postAddProduct = (req, res) => {
  const { title, imageUrl, description, price } = req.body;
  const product = new Product(title, imageUrl, description, price);
  product.save();
  res.redirect('/');
};

exports.getEditProduct = (req, res) => {
  const { edit } = req.query;
  if (!edit) return res.redirect('/');

  const { productId } = req.params;

  Product.findById(productId, product => {
    if (!product) return res.redirect('/');
    res.render('admin/edit-product', {
      title: 'Edit Product',
      path: '/admin/edit-product',
      editing: edit,
      product
    });
  });
};

exports.postEditProduct = (req, res) => {};

exports.getProducts = (req, res) => {
  Product.fetchAll(products => {
    res.render('admin/products', {
      products,
      title: 'Admin Products',
      path: '/admin/products'
    });
  });
};
