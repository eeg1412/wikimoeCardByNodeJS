var mongoose = require('mongoose');
require('mongoose-long')(mongoose);
var Schema = mongoose.Schema;
var SchemaTypes = mongoose.Schema.Types;
// Schema
var guessCard = new Schema({
  card:{type: Array, default: []},
  attackIndex:{type: Array, default: []},
  time:{type: SchemaTypes.Long, default: 0},
  open:{type: Boolean, default: false}
});

module.exports = mongoose.model('guessCard', guessCard);