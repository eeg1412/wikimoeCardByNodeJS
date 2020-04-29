var userStatisticsModel = require('../../models/v3/userStatistics');
exports.findOneAndUpdate = async function (conditions, update) {
    let options = {
        upsert: false
    }
    return await userStatisticsModel.findOneAndUpdate(conditions, update, options);
}
exports.findOne = async function (parmas) {
    return await userStatisticsModel.findOne(parmas);
}

exports.save = async function (parmas) {
    // document作成
    var newData = new userStatisticsModel(parmas);
    // document保存
    return await newData.save()
}

exports.updateOne = async function (filters, parmas) {
    // document查询
    const dataRes = await userStatisticsModel.updateOne(filters, parmas);
    return dataRes;
}