const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const nodeSchema = new Schema({
  value: {
    type: String,
    required: true,
    unique: true
  }
});

const Node = mongoose.model('node', nodeSchema);

module.exports = Node;