var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Schema
var users = new Schema({
  email:String,
  password:String,
  verify:{code:Number,time:Number},
  card: {},
  ip:String
});

module.exports = mongoose.model('users', users);