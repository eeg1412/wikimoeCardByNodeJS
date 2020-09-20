var utils = require('../utils/utils');
var chalk = require('chalk');
var cardData = require('../utils/database/cardData');
var userbattleinfoData = require('../utils/database/userbattleinfo');

module.exports = async function (req, res, next) {
    let IP = utils.getUserIp(req);
    let token = req.body.token;
    let packageId = req.body.packageId || 0;
    const battleOnly = req.body.battleOnly || false;
    console.info(
        chalk.green('开始查询战斗信息,IP为：' + IP)
    )
    //解析token
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
    let cardLevelData = {};
    if (result) {
        let myCard = result.card || {};
        let card = myCard[packageId];
        let battleCardCount = {};
        const battleCard = result.battleCard || [];
        if (card || (battleOnly && battleCard.length > 0)) {
            let haveCardId = [];
            if (battleOnly) {
                haveCardId = battleCard.map(Number);
            } else {
                haveCardId = Object.keys(card).map(Number);
            }
            let params = {
                cardId: { $in: haveCardId }
            }
            let myCardData = await cardData.findCardDataMany(params, '-__v -auther -md5').catch((err) => {
                res.send({
                    code: 0,
                    msg: '内部错误请联系管理员！'
                });
                console.error(
                    chalk.red('数据库查询错误！')
                );
                throw err;
            });
            card = myCardData;
            let getLevel = '-_id';
            for (let i = 0; i < myCardData.length; i++) {
                getLevel = getLevel + ' cardLevel.' + myCardData[i].cardId;
                // 筛选对战卡牌计数
                if (battleOnly) {
                    battleCardCount[myCardData[i].cardId] = myCard[myCardData[i].packageId][myCardData[i].cardId];
                }

            }
            cardLevelData = await userbattleinfoData.findOne({ email: result.email }, getLevel).catch((err) => {
                res.send({
                    code: 0,
                    msg: '内部错误请联系管理员！'
                });
                console.error(
                    chalk.red('数据库错误！')
                );
                throw err;
            }) || {};
        }
        card = card || [];

        // 筛选对战卡牌计数
        let cardCount = {};
        if (battleOnly) {
            cardCount = battleCardCount;
        } else {
            cardCount = myCard[packageId] || {};
        }

        res.send({
            code: 1,
            card: card,
            md5: result.md5,
            nickName: result.nickName,
            score: result.score,
            level: result.level,
            cardCount: cardCount,
            cardLevelData: cardLevelData['cardLevel'] || {},
            cardIndexCount: result.cardIndexCount
        });
    } else {
        res.send({
            code: 403,
            msg: '账户信息已失效，请重新登录！'
        });
        console.info(
            chalk.yellow('查询结果无该用户,IP为：' + IP)
        );
        return false;
    }
}