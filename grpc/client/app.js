const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const express = require('express');

// set up express app
const app = express();

// protocol buffer file -> javascript representation of file -> gRPC object that's useable
const protoPath = './item.proto';
const packageDefinition = protoLoader.loadSync(protoPath, {});
const grpcObject = grpc.loadPackageDefinition(packageDefinition);
// gRPC client
const client = new grpcObject.Itemizer(
  'grpc-server:3000',
  grpc.credentials.createInsecure(),
);

// use body-parser middleware
app.use(express.json());

// unary
app.post('/item', (req, res, next) => {
  client.createItem({ name: req.body.name }, (err, response) => {
    if (err) next(err);
    res.status(201).send(response);
  });
});
app.post('/items', (req, res, next) => {
  const items = req.body.map((item) => ({ name: item.name }));
  client.createItems({ items }, (err, response) => {
    if (err) next(err);
    res.status(201).send(response);
  });
});
app.get('/items', (req, res, next) => {
  client.getItems(null, (err, response) => {
    if (err) next(err);
    res.status(200).send(response.items);
  });
});

// client stream
app.post('/items_stream', (req, res, next) => {
  const items = req.body.map((item) => ({ name: item.name }));
  const call = client.createItemsStream((err, response) => {
    if (err) next(err);
    res.status(201).send(response);
  });
  items.forEach((item) => call.write(item));
  call.end();
});

// server stream
app.get('/items_stream', (req, res, next) => {
  const items = [];
  const call = client.getItemsStream();
  call.on('data', (item) => items.push(item));
  call.on('end', () => res.status(200).send(items));
});

// bidirectional stream
app.post('/find_items_stream', (req, res, next) => {
  const items = req.body.map((item) => ({ name: item.name }));
  const found = [];
  const call = client.findItemsStream();
  items.forEach((item) => {
    call.write(item);
  });
  call.on('data', (foundResponse) => {
    found.push(foundResponse.found);
    if (found.length === items.length) call.end();
  });
  call.on('end', () => res.status(200).send(found));
});

// error handling
app.use((err, req, res, next) => {
  res.status(err.status ? err.status : 500).send({
    error: err.message,
  });
});

// listen for requests
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Listening for requests on port ${PORT}.`);
});
