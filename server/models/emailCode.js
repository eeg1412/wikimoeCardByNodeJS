var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Schema
var emailCode = new Schema({
  email:String,
  code:{type: String, default: '0'},
  time:{type: Number, default: 0},
  count:{type: Number, default: 0},
  ip:String
});

module.exports = mongoose.model('emailCode', emailCode);