var chalk = require('chalk');
var fs = require('fs');
var utils = require('../utils');
var adminAccount = require('../database/adminAccount');
var adminLogModel = require('../../models/adminLog');

// 写入配置
exports.writeGlobalOpt = function (opt) {
    let baseConfig_ = JSON.stringify(opt);
    fs.writeFileSync('./config/config.json', baseConfig_, 'utf8');
    global.myAppConfig = Object.assign(global.myAppConfig, opt);
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
//写入管理员日志
exports.adminWriteLog = function (logObject) {
    // document作成
    var log = new adminLogModel(logObject);

    // document保存
    log.save(function(err) {
        if (err) {
            res.send({
                code:0,
                msg:'内部错误请联系管理员！'
            });
            console.error(
                chalk.red('管理员日志写入错误！')
            );
            throw err
        }else{
            console.info(
                chalk.green('管理员日志写入成功。')
            );
        };
    });
}