const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: [true],
    validate: [isEmail, 'Invalid Email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password cannot be less than 8 characters']
  }
});

// saving user
userSchema.pre('save', function(next){
  const salt = bcrypt.genSaltSync();
  this.password = bcrypt.hashSync(this.password, salt);
  next();
});

// user login
userSchema.statics.login = async function(email, password){
  const user = await this.findOne({ email });
  if(user){
    const auth = await bcrypt.compare(password, user.password);
    if(auth){
      return user;
    }
    // throw Error(JSON.stringify({ password: 'Incorrect password' }));
  }
  // throw Error(JSON.stringify({ email: `The email ${email} does not exist` }));
  throw Error(JSON.stringify({ login: 'Email and password do not match' }));
}

const User = mongoose.model('user', userSchema);

module.exports = User;