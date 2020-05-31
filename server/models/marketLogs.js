var mongoose = require('mongoose');
require('mongoose-long')(mongoose);
var Schema = mongoose.Schema;
var SchemaTypes = mongoose.Schema.Types;
// Schema
var marketLog = new Schema({
  cardId: { type: String, default: "" },
  lowPrice: { type: Number, default: 0 },
  highPrice: { type: Number, default: 0 },
  time: { type: SchemaTypes.Long, default: 0 },
});

module.exports = mongoose.model('marketLog', marketLog);