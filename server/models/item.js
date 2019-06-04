var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Schema
var useritems = new Schema({
  email:String,
  item:{},
});

module.exports = mongoose.model('useritems', useritems);