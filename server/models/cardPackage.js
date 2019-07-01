var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Schema
var cardPackages = new Schema({
  name:String,
  packageId:String,
  open:{type: Boolean, default: false}
});

module.exports = mongoose.model('cardPackages', cardPackages);