const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const authRouter = require('./routes/auth');
const { authMiddleware, userMiddleware } = require('./middleware/auth');

// set up express app
const app = express();

// middleware
app.use(express.json());
app.use(cookieParser());

// view engine
app.set('view engine', 'pug');

// connect to mongodb
mongoose.connect('mongodb://mongo:27017/jwt', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB database.');
});

// routes
app.get('*', userMiddleware);
app.get('/', (req, res) => res.render('index'));
app.get('/protected', authMiddleware, (req, res) => res.render('protected'));
app.use(authRouter);

// listen for requests
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Listening for requests on port ${PORT}.`);
});
