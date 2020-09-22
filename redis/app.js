const express = require('express');

// set up express app
const app = express();

// use body-parser middleware
app.use(express.json());

// initialize routes
app.use('/api', require('./routes/api'));

// listen for requests
const PORT = process.env.port || 3000;
app.listen(PORT, () => {
  console.log(`Listening for requests on port ${PORT}.`);
});
