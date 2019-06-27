var mongoose = require('mongoose');
require('mongoose-long')(mongoose);
var Schema = mongoose.Schema;
var SchemaTypes = mongoose.Schema.Types;

// Schema
var demining = new Schema({
    boomNum:{type: Number, default: 0},
    boomedNum:{type: Number, default: 0},
    creatTime:{type: SchemaTypes.Long, default: 0},
    mapType:{type: Number, default: 1},
    rows:{type: Number, default: 2},
    cols:{type: Number, default: 2},
    player:{},
    map:[],
    close:{type: Number, default: 0},
});

module.exports = mongoose.model('demining', demining);