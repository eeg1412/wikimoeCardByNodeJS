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
  allCardCount: { type: Boolean, default: false },
  disabledCardCount: { type: Boolean, default: false },
  open: { type: Boolean, default: false },
  guessOpen: { type: Boolean, default: false },
  starCoinOpen: { type: Boolean, default: false },
  starShopOpen: { type: Boolean, default: false },
});

module.exports = mongoose.model('v3GameCardPackages', cardPackages);