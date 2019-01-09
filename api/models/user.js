const mongoose = require('mongoose');

// User Schema
const userSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  username:{
    type: String,
    required: true,
    unique: true
  },
  password:{
    type: String,
    required: true
  }
});

module.exports = mongoose.model('User', userSchema);