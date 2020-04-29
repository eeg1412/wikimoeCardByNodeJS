const userGuessCardInfoModel = require('../../models/v3/userGuessCardInfo');

exports.saveUserGuessCard = async function (parmas) {
    // document作成
    var userGuessCard = new userGuessCardInfoModel(parmas);
    // document保存
    return await userGuessCard.save()
}
exports.findUserGuessCardOne = async function (parmas) {
    return await userGuessCardInfoModel.findOne(parmas);
}
exports.findUserGuessCardMany = async function (parmas, getInfo = '-__v') {
    return await userGuessCardInfoModel.find(parmas, getInfo);
}
exports.findUserGuessCard = async function (pageSize_, page_, parmas, sort, getInfo = '-__v') {
    // document查询
    let pageSize = pageSize_;
    let page = isNaN(Math.round(page_)) ? 1 : Math.round(page_);
    page = Math.abs(page);
    let query = userGuessCardInfoModel.find(parmas, getInfo).sort(sort);
    let total = await query.countDocuments();
    let data = await query
        .find()
        .skip(pageSize * (page - 1))
        .limit(pageSize);
    return [data, total];
}
exports.updataUserGuessCard = async function (filters, parmas) {
    // document查询
    return await userGuessCardInfoModel.updateMany(filters, parmas);
}
exports.updataUserGuessCardOne = async function (filters, parmas) {
    // document查询
    return await userGuessCardInfoModel.updateOne(filters, parmas);
}
exports.deleUserGuessCard = async function (parmas) {
    // document查询
    return await userGuessCardInfoModel.deleteOne(parmas);
}
exports.deleUserGuessCardMany = async function (parmas) {
    // document查询
    return await userGuessCardInfoModel.deleteMany(parmas);
}