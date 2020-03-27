const mongodb = require('mongodb');
const { getDb } = require('../util/db');

class Product {
  constructor(title, price, description, imageUrl, id, userId) {
    this.title = title;
    this.price = price;
    this.description = description;
    this.imageUrl = imageUrl;
    this._id = id ? new mongodb.ObjectID(id) : null;
    this.userId = userId;
  }

  async save() {
    try {
      const db = getDb();
      if (this._id) {
        await db
          .collection('products')
          .updateOne({ _id: this._id }, { $set: this });
      } else {
        await db.collection('products').insertOne(this);
      }
    } catch (err) {
      console.log(err);
    }
  }

  static async fetchAll() {
    try {
      const db = getDb();
      const products = await db
        .collection('products')
        .find()
        .toArray();
      return products;
    } catch (err) {
      console.log(err);
    }
  }

  static async findById(id) {
    try {
      const db = getDb();
      const product = await db
        .collection('products')
        .find({ _id: new mongodb.ObjectID(id) })
        .next();
      return product;
    } catch (err) {
      console.log(err);
    }
  }

  static async deleteById(id) {
    try {
      const db = getDb();
      await db
        .collection('products')
        .deleteOne({ _id: new mongodb.ObjectID(id) });
    } catch (err) {
      console.log(err);
    }
  }
}

module.exports = Product;
