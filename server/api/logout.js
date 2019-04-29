var utils = require('../utils/utils');
var fs = require('fs');
var userData = require('../utils/database/user');
var chalk = require('chalk');
module.exports = async function(req, res, next){
    let token = req.body.token;
    let IP = utils.getUserIp(req);
    if(!token){
        console.info(
            chalk.yellow(IP+'参数有误！')
        )
        res.send({
            code:403,
            msg:'token为空！'
        });
        return false;
    }
    let result = await utils.tokenCheckAndEmail(token).catch ((err)=>{
        throw err;
    });
    if(!result){
        res.send({
            code:403,
            msg:'账户信息已失效，请重新登录！'
        });
        return false;
    }
    let email = result.email;
    let filters = {
        email: email
    }
    let updataParams = {
        token:''
    }
    await userData.updataUser(filters,updataParams).catch ((err)=>{
        res.send({
            code:0,
            msg:'内部错误请联系管理员！'
        });
        console.error(
            chalk.red('数据库更新错误！')
        );
        throw err;
    })
    console.info(
        chalk.green(email+'成功'+'登出，IP为：'+IP)
    )
    res.send({
        code:1,
        msg:'ok'
    });
}