var battleLogsModel = require('../../models/battleLogs');
exports.saveBattleLog = async function (parmas) {
    // document作成
    var battlelog = new battleLogsModel(parmas);
    // document保存
    return await battlelog.save()
}
exports.findBattleLogOne = async function (parmas) {
    return await battleLogsModel.findOne(parmas);
}
exports.findBattleLogs = async function (pageSize_,getInfo,page_,parmas) {
    // document查询
    let pageSize = pageSize_;
    let page = isNaN(Math.round(page_))?1:Math.round(page_);
    page = Math.abs(page);
    let query = battleLogsModel.find(parmas,getInfo).sort({'time':-1});
    let total = await query.countDocuments();
    let data = await query
        .find()
        .skip(pageSize*(page-1))
        .limit(pageSize);
    return [data,total];
}
exports.deletBattleLogs = async function (parmas) {
    // document查询
    return await battleLogsModel.deleteMany(parmas);
}