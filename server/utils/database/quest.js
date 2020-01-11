const questModel = require('../../models/quest');

exports.saveQuest = async function (parmas) {
    // document作成
    var quest = new questModel(parmas);
    // document保存
    return await quest.save()
}
exports.findQuestOne = async function (parmas) {
    return await questModel.findOne(parmas).populate('should.card');
}
exports.findQuestMany = async function (parmas,getInfo = '-__v') {
    return await questModel.find(parmas,getInfo).populate('should.card').sort({lock:-1});
}
exports.findQuest = async function (pageSize_,page_,parmas,sort,getInfo = '-__v') {
    // document查询
    let pageSize = pageSize_;
    let page = isNaN(Math.round(page_))?1:Math.round(page_);
    page = Math.abs(page);
    let query = questModel.find(parmas,getInfo).sort(sort).populate('should.card');
    let total = await query.countDocuments();
    let data = await query
        .find()
        .skip(pageSize*(page-1))
        .limit(pageSize);
    return [data,total];
}
exports.updataQuest = async function (filters,parmas) {
    // document查询
    return await questModel.updateMany(filters, parmas);
}
exports.updataQuestOne = async function (filters,parmas) {
    // document查询
    return await questModel.updateOne(filters, parmas);
}
exports.deleQuest = async function (parmas) {
    // document查询
    return await questModel.deleteOne(parmas);
}
exports.deleQuestMany = async function (parmas) {
    // document查询
    return await questModel.deleteMany(parmas);
}
exports.insertManyQuest = async function (arr) {
    // 插入多条数据
    return await questModel.insertMany(arr);
}