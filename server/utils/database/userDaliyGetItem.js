var userDaliyGetItemModel = require('../../models/v3/userDaliyGetItem');
exports.findOneAndUpdate = async function (conditions, update) {
    let options = {
        upsert: true
    }
    return await userDaliyGetItemModel.findOneAndUpdate(conditions, update, options);
}
exports.findOne = async function (parmas, getInfo) {
    return await userDaliyGetItemModel.findOne(parmas, getInfo);
}

exports.saveUserDaliyGetItem = async function (parmas) {
    // document作成
    var userDaliyGetItem = new userDaliyGetItemModel(parmas);
    // document保存
    return await userDaliyGetItem.save()
}