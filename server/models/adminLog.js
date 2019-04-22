var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Schema
var adminlog = new Schema({
  createTime: {
    type: Date,
    default: Date.now
  },
  text:String,
  ip:String
},{ 
  capped: { 
    size: 5242880	, 
    max: 1000 
  } 
});

module.exports = mongoose.model('adminlog', adminlog);