var cardDataModel = require('../../models/cardData');
exports.saveCardData = async function (parmas) {
    // document作成
    var cardData = new cardDataModel(parmas);
    // document保存
    return await cardData.save()
}
exports.findCardDataMany = async function (parmas,getInfo = '-__v') {
    return await cardDataModel.find(parmas,getInfo);
}
exports.findCardDataOne = async function (parmas) {
    return await cardDataModel.findOne(parmas);
}
exports.findCardData = async function (pageSize_,page_,parmas) {
    // document查询
    let pageSize = pageSize_;
    let page = isNaN(Math.round(page_))?1:Math.round(page_);
    let query = cardDataModel.find(parmas).sort({'time':-1});
    let total = await query.countDocuments();
    let data = await query
        .find()
        .skip(pageSize*(page-1))
        .limit(pageSize);
    return [data,total];
}
exports.updataCardData = async function (filters,parmas) {
    // document查询
    return await cardDataModel.updateOne(filters, parmas);
}
exports.deletCardData = async function (parmas) {
    // document查询
    return await cardDataModel.deleteOne(parmas);
}