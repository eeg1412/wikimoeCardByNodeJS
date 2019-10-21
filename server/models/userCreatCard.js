var mongoose = require('mongoose');
require('mongoose-long')(mongoose);
var Schema = mongoose.Schema;
var SchemaTypes = mongoose.Schema.Types;
// Schema
var usercreatcard = new Schema({
    email:String,
    md5:String,
    nickName:String,
    star: Number,
    leftType: Number,
    rightType: Number,
    cry: Number,
    title:String,
    name:String,
    pass:{type: Number, default: 0},
    check:{type: Number, default: 0},
    packageId:String,
    cardId:String,
    time:{type: SchemaTypes.Long, default: 0},
    mark:{type: String, default: ''},
});

module.exports = mongoose.model('usercreatcard', usercreatcard);