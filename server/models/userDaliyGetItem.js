var mongoose = require('mongoose');
require('mongoose-long')(mongoose);
var Schema = mongoose.Schema;
var SchemaTypes = mongoose.Schema.Types;

// Schema
var userDaliyGetItem = new Schema({
  email:String,
  count:{type: Number, default: 0},
  time:{type: SchemaTypes.Long, default: 0},
});

module.exports = mongoose.model('userDaliyGetItem', userDaliyGetItem);