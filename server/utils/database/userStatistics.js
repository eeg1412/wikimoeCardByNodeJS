var userStatisticsModel = require('../../models/v3/userStatistics');
exports.findOneAndUpdate = async function (conditions, update) {
    let options = {
        upsert: true
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