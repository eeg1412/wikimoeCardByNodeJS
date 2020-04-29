var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Schema
var userbattleinfos = new Schema({
  battleScoreHistory: { type: [{ time: Number, score: Number, win: Number, lose: Number, draw: Number }], default: [] },
  win: { type: Number, default: 0 },
  lose: { type: Number, default: 0 },
  draw: { type: Number, default: 0 },
  score: { type: Number, default: 0 },
  battleDate: {
    type: Date,
    default: Date.now
  },
  battleHitDate: {
    type: Date,
    default: Date.now
  },
  battleDailyCount: { type: Number, default: 0 },
  battled: { type: Boolean, default: false },
});

module.exports = mongoose.model('v3UserBattleInfos', userbattleinfos);