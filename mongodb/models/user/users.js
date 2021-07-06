var mongoose = require('mongoose')
require('mongoose-long')(mongoose)
var Schema = mongoose.Schema
// Schema
var users = new Schema({
  account: String,
  email: String,
  nickName: String,
  password: String,
  dailyCard: { type: Number, default: 0 },
  dailyCardDate: {
    type: Date,
    default: Date.now,
  },
  star: { type: Number, default: 0 },
  level: { type: Number, default: 0 },
  exp: { type: Number, default: 0 },
  token: { type: String, default: '' },
  ip: String,
  robotRate: { type: Number, default: 0 },
  setRobotRate: { type: Number, default: 0 },
  robotCheckDate: {
    type: Date,
    default: Date.now,
  },
  robotCheck: { type: Boolean, default: false },
  captchaLock: { type: Boolean, default: false },
  ban: { type: Boolean, default: false },
  battleInfo: {
    type: Schema.Types.ObjectId,
    ref: 'v3UserBattleInfos',
  },
  deminingInfo: {
    type: Schema.Types.ObjectId,
    ref: 'v3UserDeminingInfos',
  },
  guessCardInfo: {
    type: Schema.Types.ObjectId,
    ref: 'v3UserGuessCardInfos',
  },
  itemInfo: {
    type: Schema.Types.ObjectId,
    ref: 'v3Useritems',
  },
  daliyGetItemInfo: {
    type: Schema.Types.ObjectId,
    ref: 'v3UserDaliyGetItems',
  },
  statistics: {
    type: Schema.Types.ObjectId,
    ref: 'v3UserStatistics',
  },
  userCard: {
    type: Schema.Types.ObjectId,
    ref: 'v3UserCards',
  },
  creatDate: {
    type: Date,
    default: Date.now,
  },
})

module.exports = mongoose.model('v3Users', users)
