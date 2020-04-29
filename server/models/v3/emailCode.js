var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Schema
var emailCode = new Schema({
  email: String,
  code: { type: String, default: '0' },
  date: {
    type: Date,
    default: Date.now
  },
  count: { type: Number, default: 0 },
  ip: String
});

module.exports = mongoose.model('v3EmailCodes', emailCode);