var mongoose = require('mongoose');
require('mongoose-long')(mongoose);
var Schema = mongoose.Schema;
var SchemaTypes = mongoose.Schema.Types;
// Schema
var userPost = new Schema({
  email:{type: String, default: ''},
  text:{type: String, default: ''},
  title:{type: String, default: ''},
  time:{type: SchemaTypes.Long, default: 0},
  endTime:{type: SchemaTypes.Long, default: 0},
  type:{type: String, default: ''},
  itemId:{type: String, default: ''},
  packageId:{type: String, default: ''},
  itemNumber:{type: Number, default: 0},
});

module.exports = mongoose.model('userPost', userPost);