const express = require('express');
const amqp = require("amqplib");
const mongoose = require('mongoose');
const Message = require('./models/message');

// set up express app
const app = express();

// connect to mongodb
mongoose.connect('mongodb://mongo:27017/rabbitmq', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB database.');
});

// use body-parser middleware
app.use(express.json());

// consume
const consume = async (queue) => {
  const connection = await amqp.connect('amqp://rabbitmq:5672');
  const channel = await connection.createChannel();
  await channel.assertQueue(queue);
  channel.consume(queue, (msg) => {
    Message.create({ text: msg.content.toString() });
    channel.ack(msg);
  });
};

app.get('/', (req, res) => {
  consume('messages').then(() => {
    Message.find({}).then((messages) => {
      res.status(200).json(messages.map((message) => message.text));
    }).catch((err) => {
      res.status(500).json({ error: err.message });
    });
  }).catch((err) => {
    res.status(500).json({ error: err.message });
  });
});

// listen for requests
const PORT = process.env.port || 3000;
app.listen(PORT, () => {
  console.log(`Listening for requests on port ${PORT}.`);
});
