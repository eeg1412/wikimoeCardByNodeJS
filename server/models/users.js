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
  score:{type: Number, default: 0},
  level:{type: Number, default: 0},
  exp:{type: Number, default: 0},
  battleStamp:{type: Number, default: 0},
  deminingStamp:{type: Number, default: 0},
  deminingStarCount:{type: Number, default: 0},
  card: {},
  token:{type: String, default: ''},
  ip:String,
  ban:{type: Number, default: 0},
});

module.exports = mongoose.model('users', users);