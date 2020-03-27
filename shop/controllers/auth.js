const User = require('../models/user');

exports.getLogin = (req, res) => {
  res.render('auth/login', {
    path: '/login',
    title: 'Login',
    isAuthenticated: req.session.isLoggedIn
  });
};

exports.postLogin = async (req, res) => {
  try {
    req.session.isLoggedIn = true;
    req.session.user = await User.findById('5e7aec79e0197b9edaa77e98');
    req.session.save(err => {
      console.log(err);
      res.redirect('/');
    });
  } catch (err) {
    console.log(err);
  }
};

exports.postLogout = (req, res) => {
  req.session.destroy(err => {
    console.log(err);
    res.redirect('/');
  });
};
