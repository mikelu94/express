const mongoose = require('mongoose');

const nodeSchema = new mongoose.Schema({
  value: {
    type: String,
    required: true,
    unique: true,
  },
});

const Node = mongoose.model('node', nodeSchema);

module.exports = Node;
