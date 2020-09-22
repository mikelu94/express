const express = require('express');
const redis = require('redis');

const redisClient = redis.createClient('redis://redis:6379');

redisClient.on('connect', () => {
  console.log('Connected to Redis Cache.');
});

const apiRouter = express.Router();

apiRouter.get('/keys', (req, res) => {
  redisClient.keys('*', (err, reply) => {
    res.status(200).send(reply);
  });
});

apiRouter.get('/get/:key', (req, res) => {
  redisClient.get(req.params.key, (err, reply) => {
    res.status(200).send(reply);
  });
});

apiRouter.post('/set/:key', (req, res) => {
  redisClient.set(req.params.key, req.body.value, (err, reply) => {
    res.status(201).send(reply);
  });
});

apiRouter.post('/setex/:key', (req, res) => {
  redisClient.setex(req.params.key, req.body.seconds, req.body.value, (err, reply) => {
    res.status(201).send(reply);
  });
});

apiRouter.delete('/del/:key', (req, res) => {
  redisClient.del(req.params.key, (err, reply) => {
    res.status(204).send(reply.toString());
  });
});

module.exports = apiRouter;
