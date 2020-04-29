var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Schema
var useritems = new Schema({
  item: { type: [{ itemId: String, count: Number }], default: [] },
});

module.exports = mongoose.model('v3Useritems', useritems);