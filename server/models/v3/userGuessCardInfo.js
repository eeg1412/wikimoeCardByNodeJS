var mongoose = require('mongoose');
require('mongoose-long')(mongoose);
var Schema = mongoose.Schema;
// Schema
var v3UserGuessCardInfos = new Schema({
  guessDate: {
    type: Date,
    default: Date.now
  },
  guessDailyCount: { type: Number, default: 0 },
});

module.exports = mongoose.model('v3UserGuessCardInfos', v3UserGuessCardInfos);