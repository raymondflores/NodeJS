const { validationResult } = require('express-validator/check');

const Product = require('../models/product');

exports.getAddProduct = (req, res) => {
  res.render('admin/edit-product', {
    title: 'Add Product',
    path: '/admin/add-product',
    editing: false,
    hasError: false,
    errorMessage: null
  });
};

exports.postAddProduct = async (req, res) => {
  try {
    const { title, price, description, imageUrl } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(422).render('admin/edit-product', {
        title: 'Add Product',
        path: '/admin/add-product',
        editing: false,
        hasError: true,
        errorMessage: errors.array()[0].msg,
        product: { title, price, description, imageUrl },
        validationErrors: errors.array()
      });

    const product = new Product({
      title,
      price,
      description,
      imageUrl,
      userId: req.user
    });
    await product.save();
    res.redirect('/');
  } catch (err) {
    console.log(err);
  }
};

exports.getEditProduct = async (req, res) => {
  try {
    const { edit } = req.query;
    if (!edit) return res.redirect('/');

    const { productId } = req.params;
    const product = await Product.findById(productId);

    if (!product) return res.redirect('/');
    res.render('admin/edit-product', {
      title: 'Edit Product',
      path: '/admin/edit-product',
      editing: edit,
      product,
      hasError: false,
      errorMessage: null
    });
  } catch (err) {
    console.log(err);
  }
};

exports.postEditProduct = async (req, res) => {
  try {
    const { productId, title, price, imageUrl, description } = req.body;
    const product = await Product.findById(productId);

    if (product.userId.toString() !== req.user._id.toString())
      return res.redirect('/');

    product.title = title;
    product.price = price;
    product.imageUrl = imageUrl;
    product.description = description;

    await product.save();
    res.redirect('/admin/products');
  } catch (err) {
    console.log(err);
  }
};

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find({ userId: req.user._id });
    res.render('admin/products', {
      products,
      title: 'Admin Products',
      path: '/admin/products'
    });
  } catch (err) {
    console.log(err);
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const { productId } = req.body;
    await Product.deleteOne({ _id: productId, userId: req.user._id });
    res.redirect('/admin/products');
  } catch (err) {
    console.log(err);
  }
};
