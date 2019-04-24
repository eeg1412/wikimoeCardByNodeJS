var mongoose = require('mongoose');
require('mongoose-long')(mongoose);
var Schema = mongoose.Schema;
// Schema
var adminAccount = new Schema({
  account:String,
  password:String,
  secretkey:String,
  token:{type: String, default: ''},
  level:{type: Number, default: 0},
  ip:String,
});

module.exports = mongoose.model('adminAccount', adminAccount);