var utils = require('../utils/utils');
var userData = require('../utils/database/user');
var cardPackageData = require('../utils/database/cardPackage');
var cardData = require('../utils/database/cardData');
var cardUitls = require('../utils/card');
var md5 = require('md5-node');
var fs = require('fs');
var chalk = require('chalk');
module.exports = async function (req, res, next) {
    let IP = utils.getUserIp(req);
    console.info(
        chalk.green(req.body.email + '开始日常抽卡。IP为：' + IP)
    );
    if (req.body.email) {
        var userEmail = req.body.email;
        var sel = Math.floor(req.body.sel);
        //判断选择的卡牌编号是否有误
        if (isNaN(sel) || sel < 0 || sel > 2) {
            res.send({
                code: 0,
                msg: '参数有误！'
            });
            console.info(
                chalk.yellow(req.body.email + '传参(sel)有误！IP为：' + IP)
            );
            return false;
        }
        //验证邮箱格式
        if (utils.emailCheck(userEmail)) {
            let params = { email: userEmail }
            // document查询
            let result = await userData.findUser(params).catch((err) => {
                res.send({
                    code: 0,
                    msg: '内部错误请联系管理员！'
                });
                console.error(
                    chalk.red('数据库查询错误！')
                );
                throw err;
            })
            //判断是否有该用户
            if (result) {
                if (result.ban > 0) {
                    res.send({
                        code: 0,
                        msg: '该账户已被封禁！'
                    });
                    console.info(
                        chalk.yellow(req.body.email + '已被封禁！IP为：' + IP)
                    );
                    return false;
                }
                let dailyCard = result.dailyCard;
                // 取消竞技点抽卡加成
                let scoreChance = 0;//Math.floor(result.score/1000);
                if (isNaN(scoreChance)) {
                    res.send({
                        code: 0,
                        msg: '内部错误请联系管理员！'
                    });
                    return false;
                }
                let dailyCardTime = Math.round(Number(result.dailyCardTime) * 1000);
                let timeNow = Math.round(new Date().getTime() / 1000);
                let myDailyChance = global.myAppConfig.dailyChance + scoreChance;
                if (new Date(timeNow * 1000).toDateString() === new Date(dailyCardTime).toDateString()) {//如果是同天
                    if (dailyCard >= myDailyChance) {
                        res.send({
                            code: 3,
                            msg: '已经超过今天的抽卡次数了！'
                        });
                        console.info(
                            chalk.blue(req.body.email + '超过每日抽卡限制。IP为：' + IP)
                        );
                        return false;
                    }
                } else {
                    dailyCard = 0;
                }
                let packageId = req.body.packageId || 0;
                // 抽卡三次
                let cardIdArr = await cardUitls.chioseCard(packageId, 3);
                if (!cardIdArr) {
                    res.send({
                        code: 0,
                        msg: '抽卡失败，请检查参数！'
                    });
                    return false;
                }
                // 获取卡牌ID
                let cardId = cardIdArr[sel].cardId;
                if (cardId === undefined || cardId === null) {
                    res.send({
                        code: 0,
                        msg: '数据错误！'
                    });
                    return false;
                }

                let cardDataBase = {};
                cardDataBase['card.' + packageId + '.' + cardId] = 1;
                let emailmd5 = result.md5;
                dailyCard = dailyCard + 1;
                let filters = {
                    email: userEmail
                }
                let updataParams = {
                    dailyCard: dailyCard,
                    $inc: cardDataBase,
                    ip: IP,
                    dailyCardTime: timeNow
                }
                await userData.updataUser(filters, updataParams, true).catch((err) => {
                    res.send({
                        code: 0,
                        msg: '内部错误请联系管理员！'
                    });
                    console.error(
                        chalk.red('数据库更新错误！')
                    );
                    throw err;
                })
                console.info(
                    chalk.green('邮箱：' + userEmail + '，抽到卡牌：【' + cardId + '】! IP为：' + IP)
                );
                let logObject = {
                    email: userEmail,
                    md5: md5(userEmail),
                    nickName: result.nickName,
                    type: 'dailyCard',
                    time: timeNow,
                    data: {
                        cardId: cardId,
                        title: cardIdArr[sel].title,
                        name: cardIdArr[sel].name,
                        star: cardIdArr[sel].star,
                        packageId: packageId
                    },
                    ip: IP
                }
                utils.writeLog(logObject);
                let cardChoiseList = []
                for (let i = 0; i < cardIdArr.length; i++) {
                    cardChoiseList.push(cardIdArr[i].cardId)
                }
                const userCard = result.card || {};
                const userPackageCard = userCard[packageId] || {};
                const userCardIdList = Object.keys(userPackageCard);
                const userCardIdIndex = userCardIdList.indexOf(cardId);
                res.send({
                    code: 1,
                    cardChoiseList: cardChoiseList,
                    choiseIndex: sel,
                    emailmd5: emailmd5,
                    card: cardId,
                    packageId: packageId,
                    isNew: userCardIdIndex === -1,
                    leftGetChance: myDailyChance - dailyCard,
                    msg: 'ok'
                });
            } else {
                res.send({
                    code: 2,
                    msg: '该邮箱未注册！'
                });
                console.info(
                    chalk.blue(req.body.email + '并未注册。IP为：' + IP)
                );
            }
        } else {
            res.send({
                code: 0,
                msg: '邮箱地址格式有误！'
            });
            console.info(
                chalk.yellow('邮箱格式有误，IP为：' + IP)
            );
        }
    } else {
        res.send({
            code: 0,
            msg: '邮箱地址不能为空！'
        });
        console.info(
            chalk.yellow('邮箱为空，IP为：' + IP)
        );
    }
}