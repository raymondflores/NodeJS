const mongodb = require('mongodb');
const { MongoClient } = mongodb;

let _db;

const mongoConnect = async callback => {
  try {
    const client = await MongoClient.connect(
      'mongodb+srv://raymond:eUYFXRHm05IkgJkf@node-shop-vkcd5.mongodb.net/shop?retryWrites=true&w=majority'
    );
    _db = client.db();
    callback();
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const getDb = () => {
  if (_db) return _db;
  throw 'No Database Found!';
};

module.exports = {
  mongoConnect,
  getDb
};
