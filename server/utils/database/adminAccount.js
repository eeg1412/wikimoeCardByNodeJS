var adminAccountModel = require('../../models/adminAccount');
exports.saveAdminAccount = async function (parmas) {
    // document作成
    var adminAccount = new adminAccountModel(parmas);
    // document保存
    return await adminAccount.save()
}