const jwt = require('jsonwebtoken');
const User = require('../models/user');
const config = require('../config');

const authMiddleware = (req, res, next) => {
  const token = req.cookies.jwt;

  // check token
  if(token){
    jwt.verify(token, config.jwt.secretOrPrivateKey, config.jwt.verifyOptions, (err, decoded) => {
      if(!err){
        next();
      }
    });
  }
  res.redirect(`/login?redirect=${req.originalUrl}`);
};

const userMiddleware = (req, res, next) => {
  const token = req.cookies.jwt;

  // check token
  if(token){
    jwt.verify(token, config.jwt.secretOrPrivateKey, config.jwt.verifyOptions, async (err, decoded) => {
      if(err){
        res.locals.user = null;
      }
      else{ 
        const user = await User.findById(decoded.id);
        res.locals.user = user;
      }
      next();
    });
  }
  else{
    res.locals.user = null;
    next();
  }
};

module.exports = { authMiddleware, userMiddleware };