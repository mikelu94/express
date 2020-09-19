const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const itemSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  }
});

const Item = mongoose.model('item', itemSchema);

module.exports = Item;