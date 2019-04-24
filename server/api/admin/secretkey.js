var utils = require('../../utils/utils');
var chalk = require('chalk');
var adminAccount = require('../../utils/database/adminAccount');
var adminUtils = require('../../utils/admin/adminUtils');
var md5 = require('md5-node');
var chalk = require('chalk');
module.exports = async function(req, res, next){
    let IP = utils.getUserIp(req);
    let token = req.body.token;
    let type = req.body.type;
    console.info(
        chalk.green('开始生成管理员密钥！IP为：'+IP)
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
        if(type=='get'){
            let result = await adminAccount.findAdmin(params).catch ((err)=>{
                res.send({
                    code:0,
                    msg:'内部错误请联系管理员！'
                });
                console.error(
                    chalk.red('数据库查询错误！')
                );
                throw err;
            })
            res.send({
                code:1,
                secretkey:result.secretkey,
                msg:'ok'
            });
            let logObj = {
                text:'管理员账号'+account+'成功读取密钥。',
                ip:IP
            }
            adminUtils.adminWriteLog(logObj);
            console.info(
                chalk.green(account+'成功读取密钥。IP为：'+IP)
            )
        }else if(type=='edit'){
            let time = new Date().getTime();
            let secretkey = md5(account + time);
            let updataParams = {
                secretkey:secretkey,
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
                secretkey:secretkey,
                msg:'ok'
            });
            let logObj = {
                text:'管理员账号'+account+'成功修改密钥。',
                ip:IP
            }
            adminUtils.adminWriteLog(logObj);
            console.info(
                chalk.green(account+'成功修改密钥。IP为：'+IP)
            )
        }else{
            res.send({
                code:0,
                msg:'参数有误！'
            });
        }
        
    }else{
        res.send({
            code:0,
            msg:'参数有误！'
        });
    }
}