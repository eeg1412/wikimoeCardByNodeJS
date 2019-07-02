var utils = require('../../../utils/utils');
var adminUtils = require('../../../utils/admin/adminUtils');
var adminUtilsDatabase = require('../../../utils/database/adminAccount');
var cardPackageDatabase = require('../../../utils/database/cardPackage');
var cardDataDatabase = require('../../../utils/database/cardData');
var cardData = require('../../../data/cardData.json');
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
        let logObj = {
            text:'试图安装抽卡，但是已经安装过了。',
            ip:IP
        }
        adminUtils.adminWriteLog(logObj);
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
            adminUtilsDatabase.saveAdminAccount(adminParams);
            adminUtils.writeGlobalOpt(opt);
            // 创建初始卡牌
            // 获取卡牌数据
            let cardData_ = cardData['cardData']
            let one = 0;
            let two = 0;
            let three = 0;
            let four = 0;
            let five = 0;
            let six = 0;
            for (var index in cardData_){
                let thisCard = cardData_[index]
                let cardDataParams = {
                    cardId:Number(index),
                    star: thisCard.star,
                    leftType: thisCard.leftType,
                    rightType: thisCard.rightType,
                    cry: thisCard.cry,
                    title:thisCard.title,
                    name:thisCard.name,
                    packageId:'0'
                }
                if(thisCard.star==1){
                    one++
                }else if(thisCard.star==2){
                    two++
                }else if(thisCard.star==3){
                    three++
                }else if(thisCard.star==4){
                    four++
                }else if(thisCard.star==5){
                    five++
                }else if(thisCard.star==6){
                    six++
                }
                await cardDataDatabase.saveCardData(cardDataParams).catch ((err)=>{
                    res.send({
                        code:0,
                        msg:'内部错误请联系管理员！'
                    });
                    console.error(
                        chalk.red('数据库更新错误！')
                    );
                    throw err;
                })
                console.info(
                    chalk.green('写入卡牌：'+index+'成功！')
                );
            }
            // 创建初始卡包
            let packageParams = {
                name:'维基萌卡包',
                packageId:'0',
                open:true,
                oneStar:one,
                twoStar:two,
                threeStar:three,
                fourStar:four,
                fiveStar:five,
                sixStar:six,
            }
            await cardPackageDatabase.saveCardPackage(packageParams).catch ((err)=>{
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