var utils = require('../../utils/utils');
var chalk = require('chalk');
var adminAccount = require('../../utils/database/adminAccount');
var adminUtils = require('../../utils/admin/adminUtils');
var chalk = require('chalk');
module.exports = async function(req, res, next){
    let IP = utils.getUserIp(req);
    let token = req.body.token;
    console.info(
        chalk.green('开始登出管理员！IP为：'+IP)
    )
    // 数据验证
    if(token){//判断是否有数据
        let checkAdminResult = await adminUtils.checkAdmin(token,IP);
        if(!checkAdminResult){
            res.send({
                code:402,
                msg:'账户信息已失效，请重新登录！'
            });
            console.info(
                chalk.yellow('token解析失败,IP为：'+IP)
            )
            return false;
        }
        let account = checkAdminResult.account;
        let params = {
            account:account
        }
        let updataParams = {
            token:'',
            ip:IP
        }
        await adminAccount.updataAdmin(params,updataParams).catch ((err)=>{
            res.send({
                code:0,
                msg:'内部错误请联系管理员！'
            });
            console.error(
                chalk.red('数据库更新错误！')
            );
            throw err;
        })
        res.send({
            code:1,
            msg:'登出成功！',
            token:token
        });
        let logObj = {
            text:'管理员账号'+account+'登出成功。',
            ip:IP
        }
        adminUtils.adminWriteLog(logObj);
        console.info(
            chalk.green(account+'登出成功！IP为：'+IP)
        )
    }else{
        res.send({
            code:0,
            msg:'参数有误！'
        });
    }
}