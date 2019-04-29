var mongoose = require('mongoose');
require('mongoose-long')(mongoose);
var Schema = mongoose.Schema;
var SchemaTypes = mongoose.Schema.Types;
// Schema
var news = new Schema({
  text:{type: String, default: ''},
  title:{type: String, default: ''},
  time:{type: SchemaTypes.Long, default: 0},
  top:{type: Boolean, default: false},
});

module.exports = mongoose.model('news', news);