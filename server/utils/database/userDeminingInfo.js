var userCardModel = require('../../models/v3/userDeminingInfo');
exports.findOneAndUpdate = async function (conditions, update) {
    let options = {
        upsert: true
    }
    return await userCardModel.findOneAndUpdate(conditions, update, options);
}
exports.findOne = async function (parmas) {
    return await userCardModel.findOne(parmas);
}

exports.save = async function (parmas) {
    // document作成
    var newData = new userCardModel(parmas);
    // document保存
    return await newData.save()
}