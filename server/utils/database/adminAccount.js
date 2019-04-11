var adminAccountModel = require('../../models/adminAccount');
exports.saveAdminAccount = async function (parmas) {
    // document作成
    var adminAccount = new adminAccountModel(parmas);
    // document保存
    return await adminAccount.save()
}
exports.findAdmin = async function (parmas) {
    // document查询
    return await adminAccountModel.findOne(parmas);
}
exports.updataAdmin = async function (filters,parmas) {
    // document查询
    return await adminAccountModel.updateOne(filters, parmas);
}