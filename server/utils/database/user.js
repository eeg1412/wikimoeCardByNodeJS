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
exports.findUserInPage = async function (parmas = {},pageSize_ = 5,page_ = 1,getParams = '',sortData = {'_id':-1}) {
    // document查询
    let pageSize = pageSize_;
    let page = page_;
    let query = usersModel.find(parmas,getParams).sort(sortData);
    let total = await query.countDocuments();
    let data = await query
        .find()
        .skip(pageSize*(page-1))
        .limit(pageSize);
    let res = {
        total:total,
        data:data
    };
    return res;
}