const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Schema
const cardPackageSort = new Schema({
    type: String,
    packageSortList: [],
});

module.exports = mongoose.model('cardPackageSort', cardPackageSort);