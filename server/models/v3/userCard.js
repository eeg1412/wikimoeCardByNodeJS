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
      cardLevel: {
        type: Number,
        default: 0
      },
      cardEXP: {
        type: Number,
        default: 0
      },
      creatDate: {
        type: Date,
        default: Date.now
      },
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
      isSell: {
        type: Boolean,
        default: false
      },
    }], default: []
  },
  sharedEXP: { type: Number, default: 0 },
});

module.exports = mongoose.model('v3UserCards', v3UserCards);