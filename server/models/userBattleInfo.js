var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Schema
var userbattleinfos = new Schema({
  email:String,
  cardLevel:{},
  battleScoreHistory:{type:[{time:Number,score:Number,win:Number,lose:Number,draw:Number}],default: []},
  win:{type: Number, default: 0},
  lose:{type: Number, default: 0},
  draw:{type: Number, default: 0}
});

module.exports = mongoose.model('userbattleinfos', userbattleinfos);