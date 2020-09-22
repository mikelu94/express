const express = require('express');
const passport = require('passport');

const authRouter = express();

// auth login
authRouter.get('/login', (req, res) => {
  res.render('login');
});

// auth logout
authRouter.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

// Google
authRouter.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email'],
}));

authRouter.get('/google/redirect', passport.authenticate('google'), (req, res) => {
  res.redirect('/');
});

// Facebook
authRouter.get('/facebook', passport.authenticate('facebook'));

authRouter.get('/facebook/redirect', passport.authenticate('facebook'), (req, res) => {
  res.redirect('/');
});

module.exports = authRouter;
