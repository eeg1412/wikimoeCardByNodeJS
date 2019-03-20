var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Schema
var users = new Schema({
  email:String,
  md5:String,
  nickName:String,
  password:String,
  dailyCard:{type: Number, default: 0},
  dailyCardTime:{type: Number, default: 0},
  star:{type: Number, default: 0},
  card: {},
  ip:String
});

module.exports = mongoose.model('users', users);