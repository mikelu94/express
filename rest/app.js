const express = require('express');
const mongoose = require('mongoose');

// set up express app
const app = express();

// connect to mongodb
mongoose.connect('mongodb://mongo:27017/rest', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB database.');
});

// use body-parser middleware
app.use(express.json());

// initialize routes
app.use('/api', require('./routes/api'));

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
