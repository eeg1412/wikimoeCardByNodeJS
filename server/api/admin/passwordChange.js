var md5 = require('md5-node');
var utils = require('../../utils/utils');
var chalk = require('chalk');
var adminAccount = require('../../utils/database/adminAccount');
var adminUtils = require('../../utils/admin/adminUtils');
var chalk = require('chalk');
module.exports = async function(req, res, next){
    let IP = utils.getUserIp(req);
    let token = req.body.token;
    let password = req.body.password;
    let newPassword = req.body.newPassword;
    console.info(
        chalk.green('开始修改管理员密码！IP为：'+IP)
    )
    // 数据验证
    if(token&&password&&newPassword){//判断是否有数据
        let checkAdminResult = await adminUtils.checkAdmin(token,IP);
        if(!checkAdminResult){
            res.send({
                code:402,
                msg:'账户信息已失效，请重新登录！'
            });
            console.info(
                chalk.yellow('token解析失败,IP为：'+IP)
            )
            let logObj = {
                text:'尝试更改管理员账号密码，但是token错误。',
                ip:IP
            }
            adminUtils.adminWriteLog(logObj);
            return false;
        }
        let account = checkAdminResult.account;
        let dataPassword = checkAdminResult.password;
        if(md5(password)!==dataPassword){
            res.send({
                code:0,
                msg:'旧密码错误！'
            });
            let logObj = {
                text:'尝试更改管理员账号'+account+'密码，但是原密码错误。',
                ip:IP
            }
            adminUtils.adminWriteLog(logObj);
            console.info(
                chalk.yellow(account+'密码错误！IP为：'+IP)
            )
            return false;
        }
        let params = {
            account:account
        }
        let updataParams = {
            password:md5(newPassword),
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
            msg:'密码修改成功！',
            token:token
        });
        let logObj = {
            text:'修改管理员账号'+account+'的密码成功！',
            ip:IP
        }
        adminUtils.adminWriteLog(logObj);
        console.info(
            chalk.green(account+'密码修改成功！IP为：'+IP)
        )
    }else{
        res.send({
            code:0,
            msg:'参数有误！'
        });
    }
}