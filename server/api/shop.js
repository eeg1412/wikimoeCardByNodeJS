var utils = require('../utils/utils');
var userData = require('../utils/database/user');
var md5 = require('md5-node');
var chalk = require('chalk');
var cardUitls = require('../utils/card');
var itemData = require('../utils/database/item.js');

module.exports = async function (req, res, next) {
    let IP = utils.getUserIp(req);
    let type = req.body.type;
    let goods = req.body.goods;
    let token = req.body.token;
    let packageId = req.body.packageId || 0;
    //先解析token
    if (!token) {
        console.info(
            chalk.yellow(IP + '参数有误！')
        )
        res.send({
            code: 403,
            msg: 'token为空！'
        });
        return false;
    }
    let result = await utils.tokenCheckAndEmail(token).catch((err) => {
        throw err;
    });
    if (!result) {
        res.send({
            code: 403,
            msg: '账户信息已失效，请重新登录！'
        });
        console.info(
            chalk.yellow('查询结果无该用户,IP为：' + IP)
        );
        return false;
    }
    let email = result.email;
    console.info(
        chalk.green(IP + '的邮箱解析结果为' + email)
    )
    if (type == 0) {
        console.info(
            chalk.green(email + '选择的是抽卡类商品，IP为：' + IP)
        )
        //抽卡类商品
        let times = 0;
        let price = 0;
        let card = [];
        let cardAndStar = [];
        let databaseCard = {};
        if (goods == 0) {
            times = 1;
            price = 30;
        } else if (goods == 1) {
            times = 10;
            price = 270;
        } else if (goods == 2) {
            times = 30;
            price = 780;
        } else if (goods == 3) {
            times = 50;
            price = 1250;
        } else if (goods == 4) {
            times = 100;
            price = 2400;
        } else {
            res.send({
                code: 0,
                msg: '无该商品！'
            });
            return false;
        }
        console.info(
            chalk.green(email + '选择了' + times + '抽，IP为：' + IP)
        )
        if (result.star < price) {
            res.send({
                code: 0,
                msg: '星星不足！'
            });
            console.info(
                chalk.yellow(email + '的抽卡星星不足抽，IP为：' + IP)
            )
            return false;
        }
        let cardIdArr = await cardUitls.chioseCard(packageId, times, true, 'starShopOpen');
        if (!cardIdArr) {
            res.send({
                code: 0,
                msg: '抽卡失败，请检查参数！'
            });
            return false;
        }
        // 获取卡牌ID
        for (let i = 0; i < cardIdArr.length; i++) {
            let cardId = cardIdArr[i].cardId;
            card.push(cardId);
            cardAndStar.push([cardIdArr[i].star, cardId]);
            if (databaseCard['card.' + packageId + '.' + cardId]) {
                databaseCard['card.' + packageId + '.' + cardId] = databaseCard['card.' + packageId + '.' + cardId] + 1;
            } else {
                databaseCard['card.' + packageId + '.' + cardId] = 1;
            }
        }


        databaseCard['star'] = -price;
        let filters = {
            email: email
        }
        let updataParams = {
            $inc: databaseCard,
            ip: IP
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
        // 计算多少为新卡牌
        const userCard = result.card || {};
        const userPackageCard = userCard[packageId] || {};
        const userCardIdList = Object.keys(userPackageCard);
        let userNewCardList = [];
        card.forEach((item) => {
            const findCardIndex = userCardIdList.indexOf(item);
            if (findCardIndex === -1) {
                if (userNewCardList.indexOf(item) === -1) {
                    userNewCardList.push(item);
                }
            }
        })
        let timeNow = Math.round(new Date().getTime() / 1000);
        let logObject = {
            email: email,
            md5: md5(email),
            nickName: result.nickName,
            type: 'shop_1',
            time: timeNow,
            data: {
                card: cardAndStar,
                star: price,
                times: times,
                packageId: packageId,
            },
            ip: IP
        }
        utils.writeLog(logObject);
        console.info(
            chalk.green(email + '成功' + times + '抽，IP为：' + IP)
        )
        res.send({
            code: 1,
            packageId: packageId,
            data: card,
            newList: userNewCardList,
            msg: 'ok'
        });
    } else if (type == 1) {
        // 结缘
        console.info(
            chalk.green(email + '选择的是结缘，IP为：' + IP)
        )
        //结缘商品
        let times = 0;
        let price = 0;
        let card = [];
        let cardAndStar = [];
        let databaseCard = {};
        if (goods == 0) {
            times = 1;
            price = 1;
        } else if (goods == 1) {
            times = 10;
            price = 10;
        } else if (goods == 2) {
            times = 30;
            price = 30;
        } else {
            res.send({
                code: 0,
                msg: '无该商品！'
            });
            return false;
        }
        console.info(
            chalk.green(email + '选择了' + times + '次结缘，IP为：' + IP)
        )
        let params = {
            email: email
        }
        // 获取道具数据
        const itemData_ = await itemData.findOne(params).catch((err) => {
            res.send({
                code: 0,
                msg: '内部错误请联系管理员！'
            });
            console.error(
                chalk.red('数据库错误！')
            );
            throw err;
        }) || {};
        let userItemData = itemData_['item'] || {};//获取道具信息
        let myItemNum = userItemData['300'] || 0;
        // 判断结缘币够不够
        if (myItemNum < price) {
            res.send({
                code: 0,
                msg: '结缘币不足！'
            });
            return false;
        }
        // 抽卡
        let cardIdArr = await cardUitls.chioseCard(packageId, times, false, 'starCoinOpen');
        if (!cardIdArr) {
            res.send({
                code: 0,
                msg: '抽卡失败，请检查参数！'
            });
            return false;
        }
        // 获取卡牌ID
        for (let i = 0; i < cardIdArr.length; i++) {
            let cardId = cardIdArr[i].cardId;
            card.push(cardId);
            cardAndStar.push([cardIdArr[i].star, cardId]);
            if (databaseCard['card.' + packageId + '.' + cardId]) {
                databaseCard['card.' + packageId + '.' + cardId] = databaseCard['card.' + packageId + '.' + cardId] + 1;
            } else {
                databaseCard['card.' + packageId + '.' + cardId] = 1;
            }
        }
        // 扣除结缘币
        let itemDataBase = {};//删除的道具
        itemDataBase['item.300'] = -price;
        let updataItemParams = {
            $inc: itemDataBase,
        }
        await itemData.findOneAndUpdate(params, updataItemParams).catch((err) => {
            res.send({
                code: 0,
                msg: '内部错误请联系管理员！'
            });
            console.error(
                chalk.red('数据库错误！')
            );
            throw err;
        })
        // 用户数据库加卡
        let updataParams = {
            $inc: databaseCard,
            ip: IP
        }
        await userData.updataUser(params, updataParams, true).catch((err) => {
            res.send({
                code: 0,
                msg: '内部错误请联系管理员！'
            });
            console.error(
                chalk.red('数据库更新错误！')
            );
            throw err;
        })
        // 计算多少为新卡牌
        const userCard = result.card || {};
        const userPackageCard = userCard[packageId] || {};
        const userCardIdList = Object.keys(userPackageCard);
        let userNewCardList = [];
        card.forEach((item) => {
            const findCardIndex = userCardIdList.indexOf(item);
            if (findCardIndex === -1) {
                if (userNewCardList.indexOf(item) === -1) {
                    userNewCardList.push(item);
                }
            }
        })
        // 写入日志
        let timeNow = Math.round(new Date().getTime() / 1000);
        let logObject = {
            email: email,
            md5: md5(email),
            nickName: result.nickName,
            type: 'goen',
            time: timeNow,
            data: {
                card: cardAndStar,
                goentama: price,
                times: times,
                packageId: packageId,
            },
            ip: IP
        }
        utils.writeLog(logObject);
        // 发送数据
        console.info(
            chalk.green(email + '成功' + times + '次结缘，IP为：' + IP)
        )
        res.send({
            code: 1,
            packageId: packageId,
            data: card,
            newList: userNewCardList,
            msg: 'ok'
        });
    } else {
        res.send({
            code: 0,
            msg: '无该类型商品！'
        });
        return false;
    }
}