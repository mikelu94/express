const jwt = require('jsonwebtoken');
const User = require('../models/user');
const config = require('../config');

// handle errors
const handleSignupErrors = (err) => {
  const errors = {};

  // email uniqueness error
  if (err.code === 11000) {
    errors.email = `The email '${err.keyValue.email}' already exists`;
  }

  // validation errors
  if (err.message.includes('user validation failed')) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }

  return errors;
};

const createToken = (id) => jwt.sign({ id }, config.jwt.secretOrPrivateKey, config.jwt.signOptions);

module.exports.signupGet = (req, res) => {
  res.render('signup');
};

module.exports.signupPost = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.create({ email, password });
    const token = createToken(user._id);
    res.cookie('jwt', token, config.cookie.loginOptions);
    res.status(201).json({ success: true });
  } catch (err) {
    const errors = handleSignupErrors(err);
    res.status(400).json({ errors });
  }
};

module.exports.loginGet = (req, res) => {
  res.render('login');
};

module.exports.loginPost = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.login(email, password);
    const token = createToken(user._id);
    res.cookie('jwt', token, config.cookie.loginOptions);
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(400).json({ errors: JSON.parse(err.message) });
  }
};

module.exports.logoutGet = (req, res) => {
  res.cookie('jwt', '', config.cookie.logoutOptions);
  res.redirect('/');
};
