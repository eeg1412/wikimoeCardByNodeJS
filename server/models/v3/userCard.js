var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Schema
var v3UserCards = new Schema({
  cardList: {
    type: [{
      cardID: {
        type: Schema.Types.ObjectId,
        ref: 'v3GameCardDatas'
      },
      cardLevel: Number,
      cardEXP: Number,
      creatDate: Date,
      getDate: {
        type: Date,
        default: Date.now
      },
      isSparkle: {
        type: Boolean,
        default: false
      },
      isBattle: {
        type: Boolean,
        default: false
      },
    }], default: []
  },
  sharedEXP: { type: Number, default: 0 },
});

module.exports = mongoose.model('v3UserCards', v3UserCards);