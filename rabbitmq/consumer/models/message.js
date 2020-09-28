const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
});

const Message = mongoose.model('item', messageSchema);

module.exports = Message;
