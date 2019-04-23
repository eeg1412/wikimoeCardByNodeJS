var utils = require('../../../utils/utils');
var chalk = require('chalk');
var adminUtils = require('../../../utils/admin/adminUtils');

module.exports = function(req, res, next){
    let IP = utils.getUserIp(req);
    console.info(
        chalk.yellow(IP+'请求检查安装。')
    );
    if(global.myAppConfig.init){
        res.send({
            code:0,
            msg:'项目已安装！'
        });
        let logObj = {
            text:'试图检查安装抽卡，但是已经安装过了。',
            ip:IP
        }
        adminUtils.adminWriteLog(logObj);
        console.info(
            chalk.yellow(IP+'结果为已安装')
        );
    }else{
        res.send({
            code:1,
            msg:'项目未安装！'
        });
        console.info(
            chalk.green(IP+'结果为未安装')
        );
    }
}