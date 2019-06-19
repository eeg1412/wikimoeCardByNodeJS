var userDaliyGetItemModel = require('../../models/userDaliyGetItem');
exports.findOneAndUpdate = async function(conditions, update){
    let options = {
        upsert:true
    }
    return await userDaliyGetItemModel.findOneAndUpdate(conditions,update,options);
}
exports.findOne = async function (parmas,getInfo) {
    return await userDaliyGetItemModel.findOne(parmas,getInfo);
}