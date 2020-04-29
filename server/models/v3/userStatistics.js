var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var SchemaTypes = mongoose.Schema.Types;

// Schema
var v3UserStatistics = new Schema({
  deminingStarCount: { type: SchemaTypes.Long, default: 0 },
  deminingCount: { type: SchemaTypes.Long, default: 0 },
  cardIndexCount: { type: SchemaTypes.Long, default: 0 },
  UCC: { type: SchemaTypes.Long, default: 0 },
  guessCardCount: { type: SchemaTypes.Long, default: 0 },
  questCount: { type: SchemaTypes.Long, default: 0 },
  questTreasure: { type: SchemaTypes.Long, default: 0 },
});

module.exports = mongoose.model('v3UserStatistics', v3UserStatistics);