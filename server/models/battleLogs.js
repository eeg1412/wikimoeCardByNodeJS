var mongoose = require('mongoose');
require('mongoose-long')(mongoose);
var Schema = mongoose.Schema;
var SchemaTypes = mongoose.Schema.Types;
// Schema
var battlelogs = new Schema({
  aEmail:String,
  dEmail:String,
  time:{type: SchemaTypes.Long, default: 0},
  data:{}
});

module.exports = mongoose.model('battlelogs', battlelogs);