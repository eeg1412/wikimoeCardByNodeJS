var userBattleInfoModel = require('../../models/userBattleInfo');
exports.findOneAndUpdate = async function(conditions, update){
    let options = {
        upsert:true
    }
    return await userBattleInfoModel.findOneAndUpdate(conditions,update,options);
}
exports.findOne = async function (parmas,getInfo) {
    return await userBattleInfoModel.findOne(parmas,getInfo);
}