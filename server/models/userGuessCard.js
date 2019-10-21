var mongoose = require('mongoose');
require('mongoose-long')(mongoose);
var Schema = mongoose.Schema;
var SchemaTypes = mongoose.Schema.Types;
// Schema
var userGuessCard = new Schema({
  email:String,
  selectIndex:{type: Array, default: []},
  time:{type: SchemaTypes.Long, default: 0},
  geted:{type: Boolean, default: false},
  guessId:String
});

module.exports = mongoose.model('userGuessCard', userGuessCard);