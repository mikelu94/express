const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const mongoose = require('mongoose');
const Item = require('./models/item');

// connect to mongodb
mongoose.connect('mongodb://mongo:27017/grpc', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB database.');
});

// protocol buffer file -> javascript representation of file -> gRPC object that's useable
const protoPath = './item.proto';
const packageDefinition = protoLoader.loadSync(protoPath, {});
const grpcObject = grpc.loadPackageDefinition(packageDefinition);

// service implementation

// unary
const createItem = (call, callback) => {
  Item.create({ name: call.request.name }).then((item) => {
    callback(null, { success: true });
  }).catch((err) => {
    callback(err);
  });
};
const getItems = (call, callback) => {
  Item.find().then((items) => {
    callback(null, { items: items.map(item => ({ id: item._id, name: item.name })) });
  }).catch((err) => {
    callback(err);
  });
};
const createItems = (call, callback) => {
  const items = call.request.items.map((item) => ({ name: item.name }));
  Item.create(items).then((items) => {
    callback(null, { success: true });
  }).catch((err) => {
    callback(err);
  });
};
// client stream
const createItemsStream = (call, callback) => {
  call.on('data', (item) => {
    Item.create({ name: item.name }).catch((err) => {
      callback(err);
    });
  });
  call.on('end', () => callback(null, { success: true }));
};
// server stream
const getItemsStream = (call, callback) => {
  Item.find({}).then((items) => {
    items.forEach((item) => {
      call.write({ id: item._id, name: item.name });
    });
    call.end();
  }).catch((err) => {
    callback(err);
  });
};
// bidirectional stream
const findItemsStream = (call, callback) => {
  call.on('data', (item) => {
    Item.findOne({ name: item.name }).then((item) => {
      call.write({ found: true });
    }).catch((err) => {
      call.write({ found: false });
    });
  });
  call.on('end', () => call.end());
};

// gRPC server
const server = new grpc.Server();
server.addService(grpcObject.Itemizer.service, {
  createItem,
  createItems,
  getItems,
  createItemsStream,
  getItemsStream,
  findItemsStream,
});
server.bindAsync(
  '0.0.0.0:3000',
  grpc.ServerCredentials.createInsecure(),
  () => {
    console.log('gRPC server listening on port 3000.');
    server.start(); // callback that starts server
  },
);
