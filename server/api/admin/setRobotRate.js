var chalk = require('chalk');
var utils = require('../../utils/utils');
var userData = require('../../utils/database/user');
var adminUtils = require('../../utils/admin/adminUtils');
var validator = require('validator');
module.exports = async function(req, res, next){
    let IP = utils.getUserIp(req);
    let token = req.body.token;
    let rate = Number(req.body.rate);
    let _id = req.body.id;
    console.info(
        chalk.green('开始封禁或者解封用户,IP为：'+IP)
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
    if(!validator.isInt(rate+'',{ min:0 })){
        res.send({
            code:0,
            msg:'可疑度必须要是大于0的整数'
        });
        console.info(
            chalk.yellow(IP+'可疑度必须要是大于0的整数')
        );
        return false;
    }

    let filters = {
        _id:_id
    };
    let parmas = {
        setRobotRate:rate
    };
    userData.updataUser(filters,parmas).catch ((err)=>{
        res.send({
            code:0,
            msg:'内部错误，更新失败！'
        });
        console.error(
            chalk.red('数据库更新错误！')
        );
        throw err;
    })
    const text = '增加可疑度'+rate;
    let logObj = {
        text:'管理员'+result.account+'对id：'+_id+text,
        ip:IP
    }
    adminUtils.adminWriteLog(logObj);
    console.info(
        chalk.green(text+'操作IP：'+IP)
    );
    res.send({
        code:1,
        msg:text+'成功。'
    });
}