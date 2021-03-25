const express = require('express');
const { Kafka } = require('kafkajs');

// set up express app
const app = express();

// use body-parser middleware
app.use(express.json());

const kafka = new Kafka({ clientId: 'kafka-producer', brokers: ['kafka:9092'] });

const createTopic = async (topicName, numPartitions) => {
  const admin = kafka.admin();
  await admin.connect();
  const topics = await admin.listTopics();
  if (!topics.includes(topicName)) {
    await admin.createTopics({
      topics: [
        { topic: topicName, numPartitions },
      ],
    });
  }
};

const publish = async (topicName, message, partition) => {
  const producer = kafka.producer();
  await producer.connect();
  const result = producer.send({
    topic: topicName,
    messages: [
      { value: message, partition },
    ],
  });
  await producer.disconnect();
  return result;
};

createTopic('messages', 2);

app.post('/', (req, res) => {
  publish('messages', req.body.message, req.body.message.toUpperCase() < 'N' ? 0 : 1).then((result) => {
    res.status(200).json(result[0]);
  }).catch((err) => {
    res.status(500).json({ error: err.message });
  });
});

// listen for requests
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Listening for requests on port ${PORT}.`);
});
