var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Schema
var cardPackages = new Schema({
  name: String,
  oneStar: { type: Number, default: 0 },
  twoStar: { type: Number, default: 0 },
  threeStar: { type: Number, default: 0 },
  fourStar: { type: Number, default: 0 },
  fiveStar: { type: Number, default: 0 },
  sixStar: { type: Number, default: 0 },
  allCardCount: { type: Number, default: 0 },
  disabledCardCount: { type: Number, default: 0 },
  open: { type: Boolean, default: false },
  guessOpen: { type: Boolean, default: false },
  starCoinOpen: { type: Boolean, default: false },
  starShopOpen: { type: Boolean, default: false },
});

module.exports = mongoose.model('v3GameCardPackages', cardPackages);