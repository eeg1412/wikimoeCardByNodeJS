var mongoose = require('mongoose');
require('mongoose-long')(mongoose);
var Schema = mongoose.Schema;
var SchemaTypes = mongoose.Schema.Types;
// Schema
var ais = new Schema({
  battleCard: { type: Array },
  cardLevel: {},
  creatDate: { type: SchemaTypes.Long, default: 0 },
  battleHitStamp: { type: SchemaTypes.Long, default: 0 },
  cardIndexCount: { type: Number, default: 0 },
  score: { type: Number, default: 0 },
  loseCount: { type: Number, default: 0 },
});

module.exports = mongoose.model('ais', ais);