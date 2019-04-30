var newsModel = require('../../models/news');
exports.saveNews = async function (parmas) {
    // document作成
    var news = new newsModel(parmas);
    // document保存
    return await news.save()
}
exports.findNewsOne = async function (parmas) {
    return await newsModel.findOne(parmas);
}
exports.findNews = async function (pageSize_,page_,parmas) {
    // document查询
    let pageSize = pageSize_;
    let page = isNaN(Math.round(page_))?1:Math.round(page_);
    let query = newsModel.find(parmas).sort({'time':-1});
    let total = await query.countDocuments();
    let data = await query
        .find()
        .skip(pageSize*(page-1))
        .limit(pageSize);
    return [data,total];
}
exports.updataNews = async function (filters,parmas) {
    // document查询
    return await newsModel.updateOne(filters, parmas);
}
exports.deletNews = async function (parmas) {
    // document查询
    return await newsModel.deleteOne(parmas);
}