var mongoose = require('mongoose');
require('mongoose-long')(mongoose);
var Schema = mongoose.Schema;
// Schema
var market = new Schema({
  userID: {
    type: Schema.Types.ObjectId,
    ref: 'v3Users'
  },
  selled: { type: Boolean, default: false },
  cardID: {
    type: Schema.Types.ObjectId,
    ref: 'v3GameCardDatas'
  },
  userCardID: {
    type: Schema.Types.ObjectId,
    ref: 'v3UserCards.cardList'
  },
  price: { type: Number, default: 0 },
  date: {
    type: Date,
    default: Date.now
  },
});

module.exports = mongoose.model('market', market);