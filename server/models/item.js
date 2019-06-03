var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Schema
var items = new Schema({
  email:String,
  item:{},
});

module.exports = mongoose.model('items', items);