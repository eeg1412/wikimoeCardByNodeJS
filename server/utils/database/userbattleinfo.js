var userBattleInfoModel = require('../../models/v3/userBattleInfo');
exports.findOneAndUpdate = async function (conditions, update) {
    let options = {
        upsert: true
    }
    return await userBattleInfoModel.findOneAndUpdate(conditions, update, options);
}
exports.findOne = async function (parmas, getInfo) {
    return await userBattleInfoModel.findOne(parmas, getInfo);
}
exports.saveUserBattleInfo = async function (parmas) {
    // document作成
    var battleInfo = new userBattleInfoModel(parmas);
    // document保存
    return await battleInfo.save();
}