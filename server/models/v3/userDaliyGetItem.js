var mongoose = require('mongoose');
require('mongoose-long')(mongoose);
var Schema = mongoose.Schema;
var SchemaTypes = mongoose.Schema.Types;

// Schema
var userDaliyGetItem = new Schema({
  count: { type: Number, default: 0 },
  date: {
    type: Date,
    default: 0
  },
});

module.exports = mongoose.model('v3UserDaliyGetItem', userDaliyGetItem);