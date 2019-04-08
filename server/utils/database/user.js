var usersModel = require('../../models/users');
exports.findUser = async function (parmas) {
    // document查询
    return await usersModel.findOne(parmas);
}
exports.findUserNotAll = async function (parmas,notParams) {
    // document查询
    return await usersModel.findOne(parmas,notParams);
}
exports.updataUser = async function (filters,parmas) {
    // document查询
    return await usersModel.updateOne(filters, parmas);
}