var mongoose = require('mongoose');
require('mongoose-long')(mongoose);
var Schema = mongoose.Schema;
// Schema
var oldUsers = new Schema({
  md5:String,
  cardID:String,
  cardCount:String,
  timeStamp:String,
  todayCount:String,
  score:String,
  level:String,
  exp:String,
  exData:String,
  starCount:String,
  verifyCode:String,
  verifyCodeRemember:String,
  verifyCodeStamp:String,
  verifyCodeCount:String,
  deminingStamp:String,
  deminingStarStarCount:String,
  bouerse:String,
  guessCard:String,
});

module.exports = mongoose.model('oldUsers', oldUsers);