const mongoose = require('mongoose');

const edgeSchema = new mongoose.Schema({
  node1ID: {
    type: String,
    required: true,
  },
  node2ID: {
    type: String,
    required: true,
  },
});

const Edge = mongoose.model('edge', edgeSchema);

module.exports = Edge;
