const utils = require('../utils/utils');
const userData = require('../utils/database/user');
const md5 = require('md5-node');
const cardData = require('../utils/database/cardData');
const chalk = require('chalk');
const userbattleinfoData = require('../utils/database/userbattleinfo');

module.exports = async function (req, res, next) {
    let IP = utils.getUserIp(req);
    let type = req.body.type;
    let card = req.body.card;
    let token = req.body.token;
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
    if (type == 'search') {
        // 查卡组
        console.info(
            chalk.green(email + '成功查询了自己的战斗卡组，IP为：' + IP)
        )
        let myBattleCard = result.battleCard;
        let myCardData = [];
        if (myBattleCard.length > 0) {
            let params = {
                cardId: { $in: myBattleCard }
            }
            myCardData = await cardData.findCardDataMany(params, '-_id -__v').catch((err) => {
                res.send({
                    code: 0,
                    msg: '内部错误请联系管理员！'
                });
                console.error(
                    chalk.red('数据库查询错误！')
                );
                throw err;
            });
        }
        let getLevel = '-_id';
        for (let i = 0; i < myBattleCard.length; i++) {
            getLevel = getLevel + ' cardLevel.' + myBattleCard[i];
        }
        const cardLevelData = await userbattleinfoData.findOne({ email: result.email }, getLevel).catch((err) => {
            res.send({
                code: 0,
                msg: '内部错误请联系管理员！'
            });
            console.error(
                chalk.red('数据库错误！')
            );
            throw err;
        }) || {};
        res.send({
            code: 1,
            cardId: myBattleCard,
            data: myCardData,
            cardLevelData: cardLevelData['cardLevel'] || {},
            msg: 'ok'
        });
    } else if (type == 'save') {
        let isArr = card instanceof Array;
        // 传参必须是数组
        if (!isArr) {
            console.info(
                chalk.yellow(email + '传了非数组的卡组，IP为：' + IP)
            )
            res.send({
                code: 0,
                msg: '卡组信息有误！'
            });
            return false;
        }
        // 卡牌必须有20张
        if (card.length !== 20) {
            console.info(
                chalk.yellow(email + '传了不足20的卡组，IP为：' + IP)
            )
            res.send({
                code: 0,
                msg: '出战卡牌必须要有20张才行哦！如果您还没有20张卡组请努力抽卡吧！'
            });
            return false;
        }
        // 验证用户是否有该卡片
        let battleCardId = [];
        for (let i = 0; i < card.length; i++) {
            let cardNum = 0;
            try {
                cardNum = result.card[card[i].packageId][card[i].cardId];
            }
            catch (err) {
                console.info(
                    chalk.yellow(email + '传了他没有的战斗卡组，IP为：' + IP)
                )
                res.send({
                    code: 0,
                    msg: '出战卡牌必须要有20张才行哦！如果您还没有20张卡组请努力抽卡吧！'
                });
                return false;
            }
            if (!(cardNum > 0)) {
                console.info(
                    chalk.yellow(email + '传了他没有的战斗卡组，IP为：' + IP)
                )
                res.send({
                    code: 0,
                    msg: '出战卡牌必须要有20张才行哦！如果您还没有20张卡组请努力抽卡吧！'
                });
                return false;
            }
            let thisBattleCardId = card[i].cardId;
            battleCardId.push(thisBattleCardId);
        }
        // 去个重
        battleCardId = utils.unique(battleCardId);
        if (battleCardId.length !== 20) {
            console.info(
                chalk.yellow(email + '传了不足20的卡组，IP为：' + IP)
            )
            res.send({
                code: 0,
                msg: '出战卡牌必须要有20张才行哦！如果您还没有20张卡组请努力抽卡吧！'
            });
            return false;
        }
        // 验证通过了
        let filters = {
            email: email
        }
        let updataParams = {
            battleCard: battleCardId,
            ip: IP
        }
        await userData.updataUser(filters, updataParams).catch((err) => {
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
            chalk.green(email + '成功保存了战斗卡组，IP为：' + IP)
        )
        res.send({
            code: 1,
            msg: '卡组保存成功！'
        });
    }
}