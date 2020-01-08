var mongoose = require('mongoose');
require('mongoose-long')(mongoose);
var Schema = mongoose.Schema;
var SchemaTypes = mongoose.Schema.Types;
// Schema
var quest = new Schema({
  email:String,
  title:String,
  text:String,
  class:String,
  should:{type: [
    {
      card:{
        type: Schema.Types.ObjectId,
        ref: 'cardData'
      },
      number:Number
    }
  ], default: []},
  gift:{type: Array, default: []},
  expired:{type: SchemaTypes.Long, default: 0},
  lock:{type: Boolean, default: false},
  mark:{type: SchemaTypes.Long, default: 0}
});

module.exports = mongoose.model('quest', quest);