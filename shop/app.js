const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

const errorController = require('./controllers/error');
const User = require('./models/user');

const MONGODB_URI =
  'mongodb+srv://raymond:eUYFXRHm05IkgJkf@node-shop-vkcd5.mongodb.net/shop';

const app = express();
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'sessions'
});

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(
  session({
    secret: 'my secret',
    resave: false,
    saveUninitialized: false,
    store
  })
);

app.use(async (req, res, next) => {
  try {
    if (req.session.user) req.user = await User.findById(req.session.user._id);
    next();
  } catch (err) {
    console.log(err);
  }
});
app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);

mongoose
  .connect(MONGODB_URI)
  .then(async () => {
    let user = await User.findById('5e7aec79e0197b9edaa77e98');
    if (!user) {
      user = new User({
        name: 'Raymond',
        email: 'ray@aol.com',
        cart: { items: [] }
      });
      await user.save();
    }
    app.listen(3000);
  })
  .catch(console.log);
