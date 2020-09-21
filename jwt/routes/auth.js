const { Router } = require('express');
const authController = require('../controllers/auth');

authRouter = Router();

authRouter.get('/signup', authController.signupGet);
authRouter.post('/signup', authController.signupPost);
authRouter.get('/login', authController.loginGet);
authRouter.post('/login', authController.loginPost);
authRouter.get('/logout', authController.logoutGet);

module.exports = authRouter;