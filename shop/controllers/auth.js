const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');

const User = require('../models/user');

const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key:
        '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'
    }
  })
);

exports.getLogin = (req, res) => {
  const [errorMessage] = req.flash('error');
  res.render('auth/login', {
    path: '/login',
    title: 'Login',
    errorMessage
  });
};

exports.postLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      req.flash('error', 'Invalid email or password.');
      return res.redirect('/login');
    }

    const passwordsAreEqual = await bcrypt.compare(password, user.password);
    if (passwordsAreEqual) {
      req.session.isLoggedIn = true;
      req.session.user = user;
      req.session.save(err => {
        console.log(err);
        res.redirect('/');
      });
    } else {
      req.flash('error', 'Invalid email or password.');
      res.redirect('/login');
    }
  } catch (err) {
    console.log(err);
  }
};

exports.getSignup = (req, res, next) => {
  const [errorMessage] = req.flash('error');
  res.render('auth/signup', {
    path: '/signup',
    title: 'Signup',
    errorMessage
  });
};

exports.postSignup = async (req, res, next) => {
  try {
    const { email, password, confirmPassword } = req.body;
    const user = await User.findOne({ email });

    if (user) {
      req.flash('error', 'Email already exists.');
      return res.redirect('/signup');
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = new User({
      email,
      password: hashedPassword,
      cart: { items: [] }
    });
    await newUser.save();

    res.redirect('/');
    await transporter.sendMail({
      to: email,
      from: 'shop@nodejs.com',
      subject: 'Signup Succeeded',
      html: '<h1>You successfully signed up!</h1>'
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

exports.getResetPassword = (req, res) => {
  const [errorMessage] = req.flash('error');
  res.render('auth/reset-password', {
    path: '/reset-password',
    title: 'Reset Password',
    errorMessage
  });
};

exports.postResetPassword = (req, res) => {
  try {
    const { email } = req.body;

    crypto.randomBytes(32, async (err, buffer) => {
      if (err) {
        console.log(err);
        return res.redirect('/reset-password');
      }

      const token = buffer.toString('hex');
      const user = await User.findOne({ email });

      if (!user) {
        req.flash('error', 'No account with that email found');
        return res.redirect('/reset-password');
      }

      user.resetToken = token;
      user.resetTokenExpiration = Date.now() + 3600000;
      await user.save();

      res.redirect('/');
      await transporter.sendMail({
        to: email,
        from: 'shop@nodejs.com',
        subject: 'Password Reset',
        html: `
        <p>You requested a password reset</p>
        <p>Click this <a href="http://localhost:3000/reset-password/${token}">link</a> to set a new password</p>
      `
      });
    });
  } catch (err) {
    console.log(err);
  }
};

exports.getNewPassword = async (req, res) => {
  try {
    const [errorMessage] = req.flash('error');
    const { token } = req.params;

    const user = await User.findOne({
      resetToken: token,
      resetToken: { $gt: Date.now() }
    });

    res.render('auth/new-password', {
      path: '/new-password',
      title: 'New Password',
      errorMessage,
      userId: user._id.toString(),
      passwordToken: token
    });
  } catch (err) {
    console.log(err);
  }
};

exports.postNewPassword = async (req, res) => {
  try {
    const { password, userId, passwordToken } = req.body;
    const user = await User.findOne({
      resetToken: passwordToken,
      resetToken: { $gt: Date.now() },
      _id: userId
    });

    const hashedPassword = await bcrypt.hash(password, 12);
    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpiration = undefined;
    await user.save();
    res.redirect('/login');
  } catch (err) {
    console.log(err);
  }
};
