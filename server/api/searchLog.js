var logModel = require('../models/log');
module.exports = async function (req, res, next) {
    let pageSize = 5;
    let page = isNaN(Math.round(req.body.page)) ? 1 : Math.round(req.body.page);
    let query = logModel.find({ show: true }, "type time nickName md5 data -_id").sort({ '_id': -1 });
    let total = await query.countDocuments();
    let data = await query
        .find()
        .skip(5 * (page - 1))
        .limit(pageSize);
    res.send({
        code: 1,
        total: total,
        data: data,
        msg: 'ok！'
    });
}