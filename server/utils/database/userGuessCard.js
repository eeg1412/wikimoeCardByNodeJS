const userGuessCardModel = require('../../models/userGuessCard');

exports.saveUserGuessCard = async function (parmas) {
    // document作成
    var userGuessCard = new userGuessCardModel(parmas);
    // document保存
    return await userGuessCard.save()
}
exports.findUserGuessCardOne = async function (parmas) {
    return await userGuessCardModel.findOne(parmas);
}
exports.findUserGuessCardMany = async function (parmas,getInfo = '-__v') {
    return await userGuessCardModel.find(parmas,getInfo);
}
exports.findUserGuessCard = async function (pageSize_,page_,parmas,sort,getInfo = '-__v') {
    // document查询
    let pageSize = pageSize_;
    let page = isNaN(Math.round(page_))?1:Math.round(page_);
    page = Math.abs(page);
    let query = userGuessCardModel.find(parmas,getInfo).sort(sort);
    let total = await query.countDocuments();
    let data = await query
        .find()
        .skip(pageSize*(page-1))
        .limit(pageSize);
    return [data,total];
}
exports.updataUserGuessCard = async function (filters,parmas) {
    // document查询
    return await userGuessCardModel.updateMany(filters, parmas);
}
exports.updataUserGuessCardOne = async function (filters,parmas) {
    // document查询
    return await userGuessCardModel.updateOne(filters, parmas);
}
exports.deleUserGuessCard = async function (parmas) {
    // document查询
    return await userGuessCardModel.deleteOne(parmas);
}
exports.deleUserGuessCardMany = async function (parmas) {
    // document查询
    return await userGuessCardModel.deleteMany(parmas);
}