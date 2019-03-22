var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Schema
var log = new Schema({
  email:String,
  md5:String,
  nickName:String,
  type:{type: String, default: ''},
  time:{type: Number, default: 0},
  data:{},
  ip:String
});

module.exports = mongoose.model('log', log);