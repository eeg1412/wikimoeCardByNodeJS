var adminLogModel = require('../../models/adminLog');
var adminUtils = require('../../utils/admin/adminUtils');
var utils = require('../../utils/utils');
var chalk = require('chalk');
module.exports = async function(req, res, next){
    let IP = utils.getUserIp(req);
    let token = req.body.token;
    console.info(
        chalk.green('开始查询管理员日志,IP为：'+IP)
    )
    if(!token){
        res.send({
            code:402,
            msg:'验证已失效'
        });
        console.info(
            chalk.yellow('token为空,IP为：'+IP)
        )
        return false;
    }
    let result = await adminUtils.checkAdmin(token,IP);
    if(!result){
        res.send({
            code:402,
            msg:'账户信息已失效，请重新登录！'
        });
        console.info(
            chalk.yellow('token解析失败,IP为：'+IP)
        )
        return false;
    }
    let pageSize = 20;
    let page = isNaN(Math.round(req.body.page))?1:Math.round(req.body.page);
    page = Math.abs(page);
    if(page<=0){
        page = 1;
    }
    let query = adminLogModel.find({},"text ip createTime -_id").sort({'_id':-1});
    let total = await query.countDocuments();
    let data = await query
        .find()
        .skip(pageSize*(page-1))
        .limit(pageSize);
    res.send({
        code:1,
        total:total,
        data:data,
        msg:'ok！'
    });
    console.info(
        chalk.green('查询管理员日志成功,IP为：'+IP)
    )
}