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
    await req.user.createProduct({ title, imageUrl, description, price });
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
    const product = await Product.findByPk(productId);

    if (!product) return res.redirect('/');
    res.render('admin/edit-product', {
      title: 'Edit Product',
      path: '/admin/edit-product',
      editing: edit,
      product
    });
  } catch (err) {
    console.log(err);
  }
};

exports.postEditProduct = async (req, res) => {
  try {
    const { productId, title, price, imageUrl, description } = req.body;

    let product = await Product.findByPk(productId);
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
  const products = await req.user.getProducts();
  res.render('admin/products', {
    products,
    title: 'Admin Products',
    path: '/admin/products'
  });
};

exports.deleteProduct = async (req, res) => {
  try {
    const { productId } = req.body;
    const product = await Product.findByPk(productId);
    await product.destroy();
    res.redirect('/admin/products');
  } catch (err) {
    console.log(err);
  }
};
