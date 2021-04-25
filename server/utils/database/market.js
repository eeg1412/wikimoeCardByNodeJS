var marketModel = require('../../models/market');
var marketLogsModel = require('../../models/marketLogs');
exports.saveMarket = async function (parmas) {
    // document作成
    var market = new marketModel(parmas);
    // document保存
    return await market.save()
}
exports.findMarketOne = async function (parmas, getInfo = '-__v') {
    return await marketModel.findOne(parmas, getInfo);
}
exports.findMarketMany = async function (parmas, getInfo = '-__v') {
    return await marketModel.find(parmas, getInfo);
}
exports.findMarket = async function (pageSize_, page_, parmas, sort, getInfo = '-__v') {
    // document查询
    let pageSize = pageSize_;
    let page = isNaN(Math.round(page_)) ? 1 : Math.round(page_);
    let query = marketModel.find(parmas, getInfo).sort(sort);
    let total = await query.countDocuments();
    let data = await query
        .find()
        .skip(pageSize * (page - 1))
        .limit(pageSize);
    return [data, total];
}
exports.updataMarket = async function (filters, parmas) {
    // document查询
    return await marketModel.updateOne(filters, parmas);
}
exports.updataMarketMany = async function (filters, parmas) {
    // document查询
    return await marketModel.updateMany(filters, parmas);
}
exports.deletMarket = async function (parmas) {
    // document查询
    return await marketModel.deleteOne(parmas);
}
exports.deletMarketMany = async function (parmas) {
    // document查询
    return await marketModel.deleteMany(parmas);
}
exports.countByPackageId = async function (match) {
    const parmas = [
        {
            $match: match
        },
        {
            $group: {
                _id: "$packageId",
                count: { $sum: 1 }
            }

        }
    ]
    // document查询
    return await marketModel.aggregate(parmas);
}
exports.saveMarketLog = async function (parmas) {
    // document作成
    var mrketLog = new marketLogsModel(parmas);
    // document保存
    return await mrketLog.save()
}
exports.findMarketLog = async function (pageSize_, page_, parmas, sort) {
    // document查询
    let pageSize = pageSize_;
    let page = isNaN(Math.round(page_)) ? 1 : Math.round(page_);
    let query = marketLogsModel.find(parmas, '-__v').sort(sort);
    let total = await query.countDocuments();
    let data = await query
        .find()
        .skip(pageSize * (page - 1))
        .limit(pageSize);
    return [data, total];
}
exports.updataMarketLog = async function (filters, parmas) {
    // document查询
    return await marketLogsModel.updateOne(filters, parmas);
}
exports.deletMarketLog = async function (parmas) {
    // document查询
    return await marketLogsModel.deleteMany(parmas);
}