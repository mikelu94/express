const express = require('express');
const { Kafka } = require('kafkajs');

// set up express app
const app = express();

// use body-parser middleware
app.use(express.json());

const kafka = new Kafka({ clientId: 'kafka-consumer', brokers: ['kafka:9092'] });
let messages = [];

const consume = async (topicName) => {
  const consumer = kafka.consumer({ groupId: 'test-group' });
  await consumer.connect();
  await consumer.subscribe({ topic: topicName, fromBeginning: false });
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log({ message: message.value.toString(), topic, partition });
      messages.push({ message: message.value.toString(), topic, partition });
    },
  });
  return messages;
};

consume('messages');

app.get('/', (req, res) => {
  res.status(200).json(messages);
  messages = [];
});

// listen for requests
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Listening for requests on port ${PORT}.`);
});