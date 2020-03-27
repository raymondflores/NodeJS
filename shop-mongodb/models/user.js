const { ObjectID } = require('mongodb');
const { getDb } = require('../util/db');

class User {
  constructor(name, email, cart, id) {
    this.name = name;
    this.email = email;
    this.cart = cart;
    this._id = id;
  }

  async save() {
    try {
      const db = getDb();
      await db.collection('users').insertOne(this);
    } catch (err) {
      console.log(err);
    }
  }

  async addToCart(product) {
    try {
      const db = getDb();
      const cartItems = [...this.cart.items];
      const cartProductIndex = cartItems.findIndex(
        cp => cp.productId.toString() === product._id.toString()
      );

      if (cartProductIndex > -1) {
        cartItems[cartProductIndex].quantity += 1;
      } else {
        cartItems.push({
          productId: new ObjectID(product._id),
          quantity: 1
        });
      }

      await db
        .collection('users')
        .updateOne({ _id: this._id }, { $set: { cart: { items: cartItems } } });
    } catch (err) {
      console.log(err);
    }
  }

  async getCart() {
    try {
      const db = getDb();
      const productIds = this.cart.items.map(item => item.productId);
      const products = await db
        .collection('products')
        .find({ _id: { $in: productIds } })
        .toArray();
      const productsWithQuantity = products.map(p => ({
        ...p,
        quantity: this.cart.items.find(
          item => item.productId.toString() === p._id.toString()
        ).quantity
      }));

      return productsWithQuantity;
    } catch (err) {
      console.log(err);
    }
  }

  async deleteItemFromCart(productId) {
    try {
      const db = getDb();
      const cartItems = this.cart.items.filter(
        item => item.productId.toString() !== productId.toString()
      );

      await db
        .collection('users')
        .updateOne({ _id: this._id }, { $set: { cart: { items: cartItems } } });
    } catch (err) {
      console.log(err);
    }
  }

  async addOrder() {
    try {
      const db = getDb();
      const products = await this.getCart();
      const order = {
        items: products,
        user: {
          _id: new ObjectID(this._id),
          name: this.name
        }
      };
      await db.collection('orders').insertOne(order);

      this.cart = { items: [] };
      await db
        .collection('users')
        .updateOne({ _id: this._id }, { $set: { cart: this.cart } });
    } catch (err) {
      console.log(err);
    }
  }

  async getOrders() {
    try {
      const db = getDb();
      const orders = await db
        .collection('orders')
        .find({ 'user._id': new ObjectID(this._id) })
        .toArray();

      return orders;
    } catch (err) {
      console.log(err);
    }
  }

  static async findById(id) {
    try {
      const db = getDb();
      const user = await db
        .collection('users')
        .findOne({ _id: new ObjectID(id) });

      return user;
    } catch (err) {
      console.log(err);
    }
  }
}

module.exports = User;
