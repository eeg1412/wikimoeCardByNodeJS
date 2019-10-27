var usersModel = require('../../models/users');
var utils = require('../utils');

exports.findUser = async function (parmas) {
    // document查询
    return await usersModel.findOne(parmas);
}
exports.findUserMany = async function (parmas,getInfo = '-__v',sortData = {'_id':-1}) {
    return await usersModel.find(parmas,getInfo).sort(sortData);
}
exports.findUserNotAll = async function (parmas,notParams) {
    // document查询
    return await usersModel.findOne(parmas,notParams);
}
exports.updataUser = async function (filters,parmas,updateIndex) {
    // document查询
    let upRes = await usersModel.updateOne(filters, parmas);
    if(updateIndex){
        let upCountRes = await utils.setCardCount(filters.email);
        if(!upCountRes){
            throw '更新获取卡牌收集率失败';
        }
    }
    return upRes
}
exports.updataUserMany = async function (filters,parmas) {
    // document查询
    let upRes = await usersModel.updateMany(filters, parmas);
    return upRes
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