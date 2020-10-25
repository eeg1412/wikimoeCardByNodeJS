var mongoose = require('mongoose');
require('mongoose-long')(mongoose);
var Schema = mongoose.Schema;
var SchemaTypes = mongoose.Schema.Types;
// Schema
var log = new Schema({
  email: String,
  md5: String,
  nickName: String,
  type: { type: String, default: '' },
  time: { type: SchemaTypes.Long, default: 0 },
  data: {},
  show: { type: Boolean, default: true },
  ip: String
}, { capped: 15728640 });

module.exports = mongoose.model('log', log);