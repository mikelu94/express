const express = require('express');
const graphqlHTTP = require('express-graphql');
const schema = require('./graphql/schema');
const mongoose = require('mongoose');

// set up express app
const app = express();

//connect to mongodb
mongoose.connect('mongodb://mongo:27017/graphql', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB database.');
});

// // initialize routes
app.use('/graphql', graphqlHTTP({
  schema,
  graphiql: true
}));

// listen for requests
const PORT = process.env.port || 3000;
app.listen(PORT, () => {
  console.log(`Listening for requests on port ${PORT}.`)
});