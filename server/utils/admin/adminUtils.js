var chalk = require('chalk');
var fs = require('fs');
var utils = require('../utils');
var adminAccount = require('../database/adminAccount');

// 写入配置
exports.writeGlobalOpt = function (opt) {
    let baseConfig = {
        init:'true',
		sessionSecret:opt.sessionSecret,//session加密字符串
		JWTSecret:opt.JWTSecret,//JWT加密字符串
		dailyChance:opt.dailyChance,//每日抽卡次数
		smtpHost: opt.smtpHost,//邮件发送host
		smtpPort: opt.smtpPort,//邮件发送端口
		smtpAuth: {
			user: opt.smtpAuth.user,//用户名
			pass: opt.smtpAuth.pass//密码
		}
    };
    let baseConfig_ = JSON.stringify(baseConfig);
    fs.writeFileSync('./config/config.json', baseConfig_, 'utf8');
    global.myAppConfig = Object.assign(global.myAppConfig, baseConfig);
    console.info(
        chalk.green('配置修改成功，新的配置为：')
    );
    console.info(
        chalk.green(JSON.stringify(global.myAppConfig))
    );
}

exports.checkAdmin = async function (token,IP){
    let tokenDecode = await utils.tokenCheck(token).catch ((err)=>{
        console.info(
            chalk.yellow('登录信息已失效！')
        );
        return false;
    });
    if(!tokenDecode.account){
        console.info(
            chalk.yellow('登录信息有误！')
        );
        return false;
    }
    let account = tokenDecode.account;
    let params = {
        account:account
    }
    let result = await adminAccount.findAdmin(params).catch ((err)=>{
        console.error(
            chalk.red('数据库查询错误！')
        );
        throw err;
    })
    if(!result){
        return false;
    }
    if((result.token!=token)||(result.token=='')){
        console.info(
            chalk.yellow(account+'和数据库的token对不上,IP为：'+IP)
        )
        return false;
    }else{
        return result;
    }
}