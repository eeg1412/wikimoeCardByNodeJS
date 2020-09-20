var cardPackageSortModel = require('../../models/cardPackageSort');
exports.findOneAndUpdate = async function (conditions, update) {
    let options = {
        upsert: true
    }
    return await cardPackageSortModel.findOneAndUpdate(conditions, update, options);
}
exports.findOne = async function (parmas) {
    return await cardPackageSortModel.findOne(parmas);
}
exports.findMany = async function (parmas, getInfo = '-__v') {
    return await cardPackageSortModel.find(parmas, getInfo);
}