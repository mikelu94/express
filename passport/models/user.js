const mongoose = require('mongoose');
const findOrCreate = require('mongoose-findorcreate');

const userSchema = new mongoose.Schema({
  displayName: {
    type: String,
  },
  provider: {
    type: String,
    required: true,
  },
  providerID: {
    type: Number,
    required: true,
  },
});

userSchema.plugin(findOrCreate);
userSchema.index({ provider: 1, providerID: 1 }, { unique: true });

const User = mongoose.model('user', userSchema);

module.exports = User;
