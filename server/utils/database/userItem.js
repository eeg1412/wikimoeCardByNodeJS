var itemModel = require('../../models/v3/userItem');
exports.findOneAndUpdate = async function (conditions, update) {
    let options = {
        upsert: true
    }
    return await itemModel.findOneAndUpdate(conditions, update, options);
}
exports.findOne = async function (parmas) {
    return await itemModel.findOne(parmas);
}

exports.saveItem = async function (parmas) {
    // document作成
    var userItem = new itemModel(parmas);
    // document保存
    return await userItem.save()
}