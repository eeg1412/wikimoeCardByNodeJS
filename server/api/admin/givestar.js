var chalk = require('chalk');
var utils = require('../../utils/utils');
var userData = require('../../utils/database/user');
var adminUtils = require('../../utils/admin/adminUtils');
module.exports = async function(req, res, next){
    let IP = utils.getUserIp(req);
    let token = req.body.token;
    let email = req.body.email;
    let sendAll = req.body.sendAll;
    let star = Math.round(req.body.star);
    console.info(
        chalk.green('开始赠送星星,IP为：'+IP)
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
    if(isNaN(star)||star<=0){
        res.send({
            code:0,
            msg:'参数不正确！'
        });
        console.info(
            chalk.yellow(star+'star为非数值或为0,IP为：'+IP)
        )
        return false;
    }
    if(!utils.emailCheck(email)&&!sendAll){
        res.send({
            code:0,
            msg:'参数不正确！'
        });
        console.info(
            chalk.yellow(email+'邮箱地址有误,IP为：'+IP)
        )
        return false;
    }
    let result = await adminUtils.checkAdmin(token,IP);
    let account = result.account;
    if(!result){
        res.send({
            code:402,
            msg:'账户信息已失效，请重新登录！'
        });
        let logObj = {
            text:'尝试给'+email+'送星星，但是管理员token有误。',
            ip:IP
        }
        adminUtils.adminWriteLog(logObj);
        console.info(
            chalk.yellow('token解析失败,IP为：'+IP)
        )
        return false;
    }
    //设定给与星星
    let updateParams = {
        $inc:{
            star:star
        }
    };
    if(!sendAll){//如果不是全员赠送
        let userParams ={
            email:email
        }
        let userInfo = await userData.findUser(userParams);
        if(!userInfo){
            res.send({
                code:0,
                msg:'无该邮箱用户！'
            });
            console.info(
                chalk.yellow('没有这个送星星的用户,IP为：'+IP)
            )
            return false;
        }
        await userData.updataUser(userParams,updateParams).catch ((err)=>{
            res.send({
                code:0,
                msg:'内部错误，更新失败！'
            });
            console.error(
                chalk.red('数据库更新错误！')
            );
            throw err;
        })
    }else{
        await userData.updataUserMany({ban:0},updateParams).catch ((err)=>{
            res.send({
                code:0,
                msg:'内部错误，更新失败！'
            });
            console.error(
                chalk.red('数据库更新错误！')
            );
            throw err;
        })
    }
    res.send({
        code:1,
        msg:'成功给'+(email || '全员')+'赠送了'+star+'颗星星！'
    });
    let logObj = {
        text:'管理员账号'+account+'给邮箱：'+(email || '全员')+'赠送了'+star+'颗星星。',
        ip:IP
    }
    adminUtils.adminWriteLog(logObj);
}