var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Schema
var log = new Schema({
  email: String,
  md5: String,
  nickName: String,
  type: { type: String, default: '' },
  date: {
    type: Date,
    default: Date.now
  },
  data: {},
  ip: String
}, { capped: { size: 5242880, max: 1000 } });

module.exports = mongoose.model('v3Logs', log);