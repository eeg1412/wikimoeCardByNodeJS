var userPostModel = require('../../models/userPost');
exports.saveUserPost = async function (parmas) {
    // document作成
    var userPost = new userPostModel(parmas);
    // document保存
    return await userPost.save()
}
exports.findUserPostOne = async function (parmas,getInfo = '-__v') {
    return await userPostModel.findOne(parmas);
}
exports.findUserPostMany = async function (parmas,getInfo = '-__v') {
    return await userPostModel.find(parmas);
}
exports.findUserPost = async function (pageSize_,page_,parmas) {
    // document查询
    let pageSize = pageSize_;
    let page = isNaN(Math.round(page_))?1:Math.round(page_);
    if(page<=0){
        page = 1;
    }
    let query = userPostModel.find(parmas).sort({'time':-1}).lean();
    let total = await query.countDocuments();
    let data = await query
        .find()
        .skip(pageSize*(page-1))
        .limit(pageSize);
    return [data,total];
}
exports.updataUserPost = async function (filters,parmas) {
    // document查询
    return await userPostModel.updateOne(filters, parmas);
}
exports.deletUserPost = async function (parmas) {
    // document查询
    return await userPostModel.deleteMany(parmas);
}