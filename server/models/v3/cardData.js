var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Schema
var cardData = new Schema({
    star: Number,
    leftType: Number,
    rightType: Number,
    cry: Number,
    title: String,
    name: String,
    packageId: {
        type: Schema.Types.ObjectId,
        ref: 'v3GameCardPackages'
    },
    auther: String,
    md5: String,
    disabled: { type: Boolean, default: false },
});

module.exports = mongoose.model('v3GameCardDatas', cardData);