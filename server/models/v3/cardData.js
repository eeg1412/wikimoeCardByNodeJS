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
    packageId: String,
    auther: String,
    md5: String,
    disabled: Boolean,
});

module.exports = mongoose.model('v3GameCardDatas', cardData);