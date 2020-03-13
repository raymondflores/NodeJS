const Product = require('../models/product');

exports.getAddProduct = (req, res) => {
  res.render('admin/edit-product', {
    title: 'Add Product',
    path: '/admin/add-product',
    editing: false
  });
};

exports.postAddProduct = async (req, res) => {
  try {
    const { title, imageUrl, description, price } = req.body;
    const product = new Product(null, title, imageUrl, description, price);
    await product.save();
    res.redirect('/');
  } catch (err) {
    console.log(err);
  }
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

exports.postEditProduct = (req, res) => {
  const { productId, title, price, imageUrl, description } = req.body;
  const product = new Product(productId, title, imageUrl, description, price);
  product.save();
  res.redirect('/admin/products');
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

exports.deleteProduct = (req, res) => {
  const { productId } = req.body;
  Product.deleteById(productId);
  res.redirect('/admin/products');
};
