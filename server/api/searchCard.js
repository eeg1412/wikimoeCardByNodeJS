var utils = require('../utils/utils');
var cardData = require('../utils/database/cardData');
var userData = require('../utils/database/user');
var chalk = require('chalk');
module.exports = async function (req, res, next) {
    console.info(
        chalk.green('查询' + req.body.md5 + '的卡牌。')
    );
    let userMD5 = req.body.md5;
    let packageId = req.body.packageId || 0;
    if (!utils.md5Check(userMD5)) {
        res.send({
            code: 0,
            msg: '参数有误！'
        });
        return false;
    }
    let params = { md5: userMD5, ban: 0 };
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
    if (result) {
        let myCard = result.card || {};
        let card = myCard[packageId];
        if (card) {
            let haveCardId = Object.keys(card).map(Number);
            let params = {
                cardId: { $in: haveCardId }
            }
            let myCardData = await cardData.findCardDataMany(params, '-__v -_id').catch((err) => {
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
        }
        card = card || [];
        res.send({
            code: 1,
            card: card,
            cardCount: myCard[packageId] || {},
            md5: result.md5,
            nickName: result.nickName,
            score: result.score,
            level: result.level,
            cardIndexCount: result.cardIndexCount,
            deminingStarCount: result.deminingStarCount,
            UCC: result.UCC,
            guessCardCount: result.guessCardCount,
            questCount: result.questCount,
        });
    } else {
        res.send({
            code: 0,
            msg: '无该用户信息！'
        });
    }
}