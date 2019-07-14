var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Schema
var cardData = new Schema({
    cardId:String,
    star: Number,
    leftType: Number,
    rightType: Number,
    cry: Number,
    title:String,
    name:String,
    packageId:String,
    auther:String,
    md5:String,
});

module.exports = mongoose.model('cardData', cardData);