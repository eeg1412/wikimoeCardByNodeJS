var md5 = require('md5-node');
var utils = require('../../utils/utils');
var chalk = require('chalk');
var adminAccount = require('../../utils/database/adminAccount');
var jwt = require('jsonwebtoken');
var chalk = require('chalk');
var adminUtils = require('../../utils/admin/adminUtils');
module.exports = async function(req, res, next){
    let IP = utils.getUserIp(req);
    let account = req.body.account;
    let password = req.body.password;
    let captcha = req.body.captcha;
    let remPass = req.body.remPass;
    console.info(
        chalk.green(account+'开始登录！IP为：'+IP)
    )
    // 数据验证
    if(account&&password&&captcha){//判断是否有数据
        if(req.session.captcha!=captcha){
            req.session.destroy((err)=> {
                if(err){
                    console.info(
                        chalk.red(IP+'验证码清理失败'+'，'+err)
                    );
                }
            })
            res.send({
                code:0,
                msg:'验证码有误！'
            });
            console.info(
                chalk.yellow('account:'+account+'图形验证码有误。IP为：'+IP)
            );
            return false;
        }
        let params = {
            account:account
        }
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
        if(!result){
            res.send({
                code:0,
                msg:'账户或密码不正确！'
            });
            let logObj = {
                text:'尝试使用管理员账号'+account+'登录，但是并没有此管理员。',
                ip:IP
            }
            adminUtils.adminWriteLog(logObj);
            console.info(
                chalk.yellow(account+'没有该账户！IP为：'+IP)
            )
            return false;
        }
        if(md5(password)!==result.password){
            res.send({
                code:0,
                msg:'账户或密码不正确！'
            });
            let logObj = {
                text:'尝试登录管理员账号：'+account+'，但是密码错误。',
                ip:IP
            }
            adminUtils.adminWriteLog(logObj);
            console.info(
                chalk.yellow(account+'密码错误！IP为：'+IP)
            )
            return false;
        }
        let content ={account:account}; // 要生成token的主题信息
        let secretOrPrivateKey= global.myAppConfig.JWTSecret; // 这是加密的key（密钥）
        let remTime = 60*60*24;
        if(remPass){
            remTime = 60*60*24*30;
        }
        let token = jwt.sign(content, secretOrPrivateKey, {
            expiresIn: remTime
        });
        let filters = {
            account: account
        }
        let updataParams = {
            token:token,
            ip:IP
        }
        await adminAccount.updataAdmin(filters,updataParams).catch ((err)=>{
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
            msg:'ok',
            token:token
        });
        let logObj = {
            text:'管理员'+account+'登录成功。',
            ip:IP
        }
        adminUtils.adminWriteLog(logObj);
        console.info(
            chalk.green(account+'登录成功！IP为：'+IP)
        )
    }else{
        res.send({
            code:0,
            msg:'参数有误！'
        });
    }
}