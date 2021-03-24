const amqp = require('amqplib');

// consume
const consume = async (queue) => {
  const connection = await amqp.connect('amqp://rabbitmq:5672');
  const channel = await connection.createChannel();
  await channel.assertQueue(queue);
  channel.consume(queue, (msg) => {
    console.log(msg.content.toString());
    channel.ack(msg);
  });
};
consume('messages');
console.log('Consuming messages.');
