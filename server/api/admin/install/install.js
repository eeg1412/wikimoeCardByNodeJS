var utils = require('../../../utils/utils');
var adminUtils = require('../../../utils/admin/adminUtils');
var adminUtilsDatabase = require('../../../utils/database/adminAccount');
var chalk = require('chalk');
var md5 = require('md5-node');

module.exports = async function(req, res, next){
    let IP = utils.getUserIp(req);
    console.info(
        chalk.yellow(IP+'请求安装')
    );
    if(global.myAppConfig.init){
        res.send({
            code:403,
            msg:'项目已安装！'
        });
        console.info(
            chalk.yellow(IP+'结果为已安装')
        );
    }else{
        if(req.body.config){
            let config_ = req.body.config;
            // 校验数据
            for(var i in config_) {
                if(!config_[i]){
                    res.send({
                        code:0,
                        msg:'参数有误！'
                    });
                    console.info(
                        chalk.yellow(IP+'有空的属性')
                    );
                    return false;
                }
            }
            config_.dailyChance = Math.abs(Math.round(config_.dailyChance));
            config_.smtpPort = Math.abs(Math.round(config_.smtpPort));
            if(isNaN(config_.dailyChance)){
                res.send({
                    code:0,
                    msg:'参数有误！'
                });
                console.info(
                    chalk.yellow(IP+'参数有误，日常抽卡次数为非数字')
                );
                return false;
            }
            if(isNaN(config_.smtpPort)){
                res.send({
                    code:0,
                    msg:'参数有误！'
                });
                console.info(
                    chalk.yellow(IP+'参数有误，邮箱端口为非数字')
                );
                return false;
            }
            let adminParams ={
                account:config_.account,
                password:md5(config_.password),
                ip:IP,
            };
            let opt = {
                sessionSecret:config_.sessionSecret,//session加密字符串
                JWTSecret:config_.JWTSecret,//JWT加密字符串
                dailyChance:config_.dailyChance,//每日抽卡次数
                smtpHost: config_.smtpHost,//邮件发送host
                smtpPort: config_.smtpPort,//邮件发送端口
                smtpAuth: {
                    user: config_.smtpAuthUser,//用户名
                    pass: config_.smtpAuthPass//密码
                }
            };
            console.log(opt)
            adminUtilsDatabase.saveAdminAccount(adminParams);
            adminUtils.writeGlobalOpt(opt);
            res.send({
                code:1,
                msg:'安装成功'
            });
            console.info(
                chalk.green(IP+'安装成功')
            );
        }else{
            res.send({
                code:0,
                msg:'参数有误！'
            });
            console.info(
                chalk.yellow(IP+'没有参数')
            );
        }
    }
}