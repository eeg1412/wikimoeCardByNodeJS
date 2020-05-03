var mongoose = require('mongoose');
require('mongoose-long')(mongoose);
var Schema = mongoose.Schema;
var SchemaTypes = mongoose.Schema.Types;
// Schema
var usercreatcard = new Schema({
    userID: {
        type: Schema.Types.ObjectId,
        ref: 'v3Users'
    },
    md5: String,
    nickName: String,
    star: Number,
    leftType: Number,
    rightType: Number,
    cry: Number,
    title: String,
    name: String,
    pass: {
        type: Boolean,
        default: false
    },
    check: {
        type: Boolean,
        default: false
    },
    packageId: {
        type: Schema.Types.ObjectId,
        ref: 'v3GameCardPackages'
    },
    cardID: {
        type: Schema.Types.ObjectId,
        ref: 'v3GameCardDatas'
    },
    date: {
        type: Date,
        default: Date.now
    },
    mark: { type: String, default: '' },
});

module.exports = mongoose.model('v3Usercreatcards', usercreatcard);