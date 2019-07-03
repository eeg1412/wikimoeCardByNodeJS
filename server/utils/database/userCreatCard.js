var userCreatCardModel = require('../../models/userCreatCard');
exports.saveUserCreatCard = async function (parmas) {
    // document作成
    var userCreatCard = new userCreatCardModel(parmas);
    // document保存
    return await userCreatCard.save()
}
exports.findUserCreatCardOne = async function (parmas) {
    return await userCreatCardModel.findOne(parmas);
}
exports.findUserCreatCardMany = async function (parmas,getInfo = '-__v') {
    return await userCreatCardModel.find(parmas,getInfo);
}
exports.findUserCreatCard = async function (pageSize_,page_,parmas,sort,getInfo = '-__v') {
    // document查询
    let pageSize = pageSize_;
    let page = isNaN(Math.round(page_))?1:Math.round(page_);
    page = Math.abs(page);
    let query = userCreatCardModel.find(parmas,getInfo).sort(sort);
    let total = await query.countDocuments();
    let data = await query
        .find()
        .skip(pageSize*(page-1))
        .limit(pageSize);
    return [data,total];
}
exports.updataUserCreatCard = async function (filters,parmas) {
    // document查询
    return await userCreatCardModel.updateOne(filters, parmas);
}
exports.deletUserCreatCard = async function (parmas) {
    // document查询
    return await userCreatCardModel.deleteOne(parmas);
}