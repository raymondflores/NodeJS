const Product = require('../models/product');

exports.getAddProduct = (req, res) => {
  res.render('admin/edit-product', {
    title: 'Add Product',
    path: '/admin/add-product',
    editing: false,
    isAuthenticated: req.session.isLoggedIn
  });
};

exports.postAddProduct = async (req, res) => {
  try {
    const { title, price, description, imageUrl } = req.body;
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
      isAuthenticated: req.session.isLoggedIn
    });
  } catch (err) {
    console.log(err);
  }
};

exports.postEditProduct = async (req, res) => {
  try {
    const { productId, title, price, imageUrl, description } = req.body;
    const product = await Product.findById(productId);

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
  const products = await Product.find();
  console.log(products);
  res.render('admin/products', {
    products,
    title: 'Admin Products',
    path: '/admin/products',
    isAuthenticated: req.session.isLoggedIn
  });
};

exports.deleteProduct = async (req, res) => {
  try {
    const { productId } = req.body;
    await Product.findByIdAndRemove(productId);
    res.redirect('/admin/products');
  } catch (err) {
    console.log(err);
  }
};
