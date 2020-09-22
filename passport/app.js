const express = require('express');
const mongoose = require('mongoose');
const config = require('./config');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const User = require('./models/user');
const authRouter = require('./routes/auth');
const cookieSession = require('cookie-session');

// set up express app
const app = express();

// view engine
app.set('view engine', 'pug');

app.use(cookieSession({
  maxAge: 24 * 60 * 60 * 1000,
  keys: config.cookieSessionKeys,
}));

// initialize passport
app.use(passport.initialize());
app.use(passport.session());

// connect to mongodb
mongoose.connect('mongodb://mongo:27017/passport', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB database.');
});

// auth
passport.serializeUser((user, cb) => {
  cb(null, user.id);
});

passport.deserializeUser((id, cb) => {
  User.findById(id).then((user) => {
    cb(null, user);
  });
});

passport.use(
  new GoogleStrategy({
    callbackURL: '/auth/google/redirect',
    clientID: config.oauth.google.clientID,
    clientSecret: config.oauth.google.clientSecret
  }, (accessToken, refreshToken, profile, cb) => {
    User.findOrCreate({
      provider: profile.provider,
      providerID: parseInt(profile.id)
    }, (err, user) => {
      user.displayName = profile.displayName;
      user.save(() => cb(err, user));
    });
  })
);

passport.use(
  new FacebookStrategy({
    callbackURL: '/auth/facebook/redirect',
    clientID: config.oauth.facebook.clientID,
    clientSecret: config.oauth.facebook.clientSecret,
    profileFields: ['id', 'displayName', 'email']
  }, (accessToken, refreshToken, profile, cb) => {
    User.findOrCreate({
      provider: profile.provider,
      providerID: parseInt(profile.id)
    }, (err, user) => {
      user.displayName = profile.displayName;
      user.save(() => cb(err, user));
    });
  })
);

// index
app.get('/', (req, res) => {
  res.render('index', {
    user: req.user,
    config,
  });
});

app.use('/auth', authRouter);

// error handling
app.use((err, req, res) => {
  res.status(err.status ? err.status : 500).send({
    error: err.message,
  });
});

// listen for requests
const PORT = process.env.port || 3000;
app.listen(PORT, () => {
  console.log(`Listening for requests on port ${PORT}.`);
});
