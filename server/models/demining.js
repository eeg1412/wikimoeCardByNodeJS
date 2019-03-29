var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Schema
var demining = new Schema({
    boomNum:{type: Number, default: 0},
    boomedNum:{type: Number, default: 0},
    creatTime:{type: Number, default: 0},
    mapType:{type: Number, default: 1},
    rows:{type: Number, default: 2},
    cols:{type: Number, default: 2},
    player:{},
    map:[],
    close:{type: Number, default: 0},
});

module.exports = mongoose.model('demining', demining);