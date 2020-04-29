var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Schema
var v3UserDeminingInfos = new Schema({
  copperPickaxe: {
    type: Date,
    default: 0
  },
  silverPickaxe: {
    type: Date,
    default: 0
  },
  goldenPickaxe: {
    type: Date,
    default: 0
  },
});

module.exports = mongoose.model('v3UserDeminingInfos', v3UserDeminingInfos);