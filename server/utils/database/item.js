var itemModel = require('../../models/item');
exports.findOneAndUpdate = async function(conditions, update){
    let options = {
        upsert:true
    }
    return await itemModel.findOneAndUpdate(conditions,update,options);
}
exports.findOne = async function (parmas) {
    return await itemModel.findOne(parmas);
}