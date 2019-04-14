var chalk = require('chalk');
var utils = require('../../utils/utils');
var userData = require('../../utils/database/user');
var adminUtils = require('../../utils/admin/adminUtils');
module.exports = async function(req, res, next){
    let IP = utils.getUserIp(req);
    let token = req.body.token;
    let page_ = isNaN(Math.round(req.body.page))?1:Math.round(req.body.page);
    console.info(
        chalk.green('开始查询用户列表,IP为：'+IP)
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
    let parmas = {};
    let pageSize_ = 5;
    let getParams = '_id email md5 nickName star score level exp deminingStarCount ip ban';
    let sortData = {'_id':-1}
    let userData_ =  await userData.findUserInPage(parmas,pageSize_,page_,getParams,sortData);

    res.send({
        code:1,
        data:userData_
    });
}