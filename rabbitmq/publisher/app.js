const express = require('express');
const amqp = require("amqplib");

// set up express app
const app = express();

// use body-parser middleware
app.use(express.json());

// publish

const publish = async (queue, message) => {
  const connection = await amqp.connect('amqp://rabbitmq:5672');
  const channel = await connection.createChannel();
  await channel.assertQueue(queue);
  await channel.sendToQueue(queue, Buffer.from(message));
  await channel.close();
  await connection.close();
};

app.post('/', (req, res) => {
  publish('messages', req.body.message).then(() => {
    res.status(201).json({ success: true });
  }).catch((err) => {
    res.status(500).json({ success: false, error: err.message });
  });
});

// listen for requests
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Listening for requests on port ${PORT}.`);
});
