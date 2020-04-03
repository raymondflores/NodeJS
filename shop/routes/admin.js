const express = require('express');
const router = express.Router();
const { body } = require('express-validator/check');

const adminController = require('../controllers/admin');
const isAuth = require('../middleware/auth');

router.get('/add-product', isAuth, adminController.getAddProduct);
router.post(
  '/add-product',
  isAuth,
  [
    body('title')
      .isAlphanumeric()
      .isLength({ min: 3 })
      .trim(),
    body('imageUrl').isURL(),
    body('price').isFloat(),
    body('description')
      .isLength({ min: 5, max: 200 })
      .trim()
  ],
  adminController.postAddProduct
);

router.get('/products', isAuth, adminController.getProducts);

router.get('/edit-product/:productId', isAuth, adminController.getEditProduct);
router.post('/edit-product', isAuth, adminController.postEditProduct);

router.post('/delete-product', isAuth, adminController.deleteProduct);

module.exports = router;
