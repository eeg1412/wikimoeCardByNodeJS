var marketModel = require('../../models/market');
var marketLogsModel = require('../../models/marketLogs');
exports.saveMarket = async function (parmas) {
    // document作成
    var market = new marketModel(parmas);
    // document保存
    return await market.save()
}
exports.findMarketOne = async function (parmas) {
    return await marketModel.findOne(parmas);
}
exports.findMarketMany = async function (parmas) {
    return await marketModel.find(parmas);
}
exports.findMarket = async function (pageSize_,page_,parmas,sort) {
    // document查询
    let pageSize = pageSize_;
    let page = isNaN(Math.round(page_))?1:Math.round(page_);
    let query = marketModel.find(parmas).sort(sort);
    let total = await query.countDocuments();
    let data = await query
        .find()
        .skip(pageSize*(page-1))
        .limit(pageSize);
    return [data,total];
}
exports.updataMarket = async function (filters,parmas) {
    // document查询
    return await marketModel.updateOne(filters, parmas);
}
exports.deletMarket = async function (parmas) {
    // document查询
    return await marketModel.deleteOne(parmas);
}

exports.saveMarketLog = async function (parmas) {
    // document作成
    var mrketLog = new marketLogsModel(parmas);
    // document保存
    return await mrketLog.save()
}
exports.findMarketLog = async function (pageSize_,page_,parmas,sort) {
    // document查询
    let pageSize = pageSize_;
    let page = isNaN(Math.round(page_))?1:Math.round(page_);
    let query = marketLogsModel.find(parmas).sort(sort);
    let total = await query.countDocuments();
    let data = await query
        .find()
        .skip(pageSize*(page-1))
        .limit(pageSize);
    return [data,total];
}
exports.updataMarketLog = async function (filters,parmas) {
    // document查询
    return await marketLogsModel.updateOne(filters, parmas);
}
exports.deletMarketLog = async function (parmas) {
    // document查询
    return await marketLogsModel.deleteMany(parmas);
}