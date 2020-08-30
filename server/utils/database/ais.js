const AisModel = require('../../models/ais');
const utils = require('../utils');

exports.saveAi = async function (parmas) {
    // document作成
    const AiData = new AisModel(parmas);
    // document保存
    return await AiData.save()
}

exports.findAi = async function (parmas) {
    // document查询
    return await AisModel.findOne(parmas);
}
exports.findAiMany = async function (parmas, getInfo = '-__v', sortData = { '_id': -1 }) {
    return await AisModel.find(parmas, getInfo).sort(sortData);
}
exports.deleteAiOne = async function (parmas) {
    // document查询
    return await AisModel.deleteOne(parmas);
}
exports.updataAi = async function (filters, parmas) {
    // document查询
    let upRes = await AisModel.updateOne(filters, parmas);
    return upRes
}
exports.updataAiMany = async function (filters, parmas) {
    // document查询
    let upRes = await AisModel.updateMany(filters, parmas);
    return upRes
}
exports.findAiInPage = async function (parmas = {}, pageSize_ = 5, page_ = 1, getParams = '', sortData = { '_id': -1 }) {
    // document查询
    let pageSize = pageSize_;
    let page = page_;
    let query = AisModel.find(parmas, getParams).sort(sortData);
    let total = await query.countDocuments();
    let data = await query
        .find()
        .skip(pageSize * (page - 1))
        .limit(pageSize);
    let res = {
        total: total,
        data: data
    };
    return res;
}
exports.deletAisMany = async function (parmas) {
    // document查询
    return await AisModel.deleteMany(parmas);
}