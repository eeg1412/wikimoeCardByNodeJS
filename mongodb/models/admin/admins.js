var mongoose = require('mongoose')
var Schema = mongoose.Schema
// Schema
var admins = new Schema({
  account: String,
  password: String,
  permissions: Number,
  creatDate: {
    type: Date,
    default: Date.now,
  },
})
module.exports = mongoose.model('v3Admins', admins)
