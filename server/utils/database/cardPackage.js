var cardPackageModel = require('../../models/cardPackage');
exports.saveCardPackage = async function (parmas) {
    // document作成
    var cardPackage = new cardPackageModel(parmas);
    // document保存
    return await cardPackage.save()
}
exports.findCardPackageOne = async function (parmas) {
    return await cardPackageModel.findOne(parmas);
}
exports.findCardPackageMany = async function (parmas,getInfo = '-__v') {
    return await cardPackageModel.find(parmas,getInfo);
}
exports.findCardPackageCount = async function (parmas) {
    let query = cardPackageModel.find(parmas);
    let total = await query.countDocuments();
    return total;
}
exports.findCardPackage = async function (pageSize_,page_,parmas) {
    // document查询
    let pageSize = pageSize_;
    let page = isNaN(Math.round(page_))?1:Math.round(page_);
    let query = cardPackageModel.find(parmas).sort({'time':-1});
    let total = await query.countDocuments();
    let data = await query
        .find()
        .skip(pageSize*(page-1))
        .limit(pageSize);
    return [data,total];
}
exports.updataCardPackage = async function (filters,parmas) {
    // document查询
    return await cardPackageModel.updateOne(filters, parmas);
}
exports.updataCardPackageMany = async function (filters,parmas) {
    // document查询
    return await cardPackageModel.updateMany(filters, parmas);
}
exports.deletCardPackage = async function (parmas) {
    // document查询
    return await cardPackageModel.deleteOne(parmas);
}