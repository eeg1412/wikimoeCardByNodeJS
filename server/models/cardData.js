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
    packageId:String
});

module.exports = mongoose.model('cardData', cardData);