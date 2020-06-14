var mongoose = require('mongoose');
require('mongoose-long')(mongoose);
var Schema = mongoose.Schema;
var SchemaTypes = mongoose.Schema.Types;
// Schema
var wantcard = new Schema({
  email: String,
  nickName: String,
  md5: String,
  cardId: { type: String, default: "" },
  packageId: { type: String, default: '0' },
  name: String,
  title: String,
  star: { type: Number, default: 0 },
  wantPrice: { type: Number, default: 30 },
  time: { type: SchemaTypes.Long, default: 0 },
});

module.exports = mongoose.model('wantcard', wantcard);