var chalk = require('chalk');
var utils = require('../../utils/utils');
var adminAccount = require('../../utils/database/adminAccount');
var adminUtils = require('../../utils/admin/adminUtils');
var fs = require('fs');
module.exports = async function(req, res, next){
    let IP = utils.getUserIp(req);
    let token = req.body.token;
    let type = req.body.type;
    let config_ = req.body.config;
    console.info(
        chalk.green('开始查询或修改配置信息,IP为：'+IP)
    )
    if(!token){
        res.send({
            code:402,
            msg:'参数不正确！'
        });
        return false;
    }
    let tokenDecode = await utils.tokenCheck(token).catch ((err)=>{
        res.send({
            code:402,
            msg:'账户信息已失效，请重新登录！'
        });
        console.info(
            chalk.yellow('登录信息已失效！')
        );
        throw err;
    });
    if(!tokenDecode.account){
        res.send({
            code:402,
            msg:'账户信息已失效，请重新登录！'
        });
        console.info(
            chalk.yellow('登录信息有误！')
        );
        return false;
    }
    let account = tokenDecode.account;
    console.info(
        chalk.green(IP+'的管理员账号解析结果为'+account)
    )
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
            code:402,
            msg:'无该用户！'
        });
        return false;
    }
    if((result.token!=token)||(result.token=='')){
        res.send({
            code:402,
            msg:'账户信息已失效，请重新登录！'
        });
        console.info(
            chalk.yellow(account+'和数据库的token对不上,IP为：'+IP)
        )
        return false;
    }
    if(type=='get'){
        console.info(
            chalk.green(account+'为查询配置,IP为：'+IP)
        )
        let myConfig = fs.readFileSync('./config/config.json', 'utf8');
        myConfig = JSON.parse(myConfig);
        res.send({
            code:1,
            data:myConfig,
            msg:'ok！'
        });
        console.info(
            chalk.green(account+'配置信息查询成功,IP为：'+IP)
        )
    }else if(type=='edit'){
        console.info(
            chalk.green(account+'为查询修改配置,IP为：'+IP)
        )
        if(!config_){
            console.info(
                chalk.yellow(account+'并没有要修改的配置信息,IP为：'+IP)
            )
            res.send({
                code:0,
                msg:'参数不正确！'
            });
            return false;
        }
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
        adminUtils.writeGlobalOpt(opt);
        res.send({
            code:1,
            msg:'修改配置成功'
        });
        console.info(
            chalk.green(account+'修改配置成功。IP为：'+IP)
        );
    }else{
        console.info(
            chalk.yellow(account+'没有请求配置类型,IP为：'+IP)
        )
        res.send({
            code:0,
            msg:'参数不正确！'
        });
    }
}