var utils = require('../utils/utils');
var cardData = require('../utils/database/cardData');
var userData = require('../utils/database/user');
const validator = require('validator');
const userCard = require('../utils/database/userCard');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
var chalk = require('chalk');
module.exports = async function (req, res, next) {
    console.info(
        chalk.green('查询' + req.body.md5 + '的卡牌。')
    );
    let userMD5 = req.body.md5;
    let packageId = req.body.packageId || '';
    let page = Number(req.body.page) || 1;
    if (!validator.isMongoId(packageId + '')) {
        res.send({
            code: 0,
            msg: '卡包有误！'
        });
        console.info(
            chalk.yellow(req.body.email + '传参(卡包ID)有误！IP为：' + IP)
        );
        return false;
    }
    if (!validator.isInt(page + '', { min: 1 })) {
        page = 1;
    }
    if (!utils.md5Check(userMD5)) {
        res.send({
            code: 0,
            msg: '参数有误！'
        });
        return false;
    }
    let params = { md5: userMD5 };
    // 通过用户信息获取用户卡牌并且分页的例子
    // let result = await userData.findUser(params, {
    //     path: 'userCard',
    //     select: { 'cardList': { '$slice': [0, 3] } },
    //     populate: {
    //         path: 'cardList.cardID',
    //         populate: {
    //             path: 'packageId',
    //         }
    //     },
    //     // match: { "cardList": { $slice: 3 } },
    // }).catch((err) => {
    //     res.send({
    //         code: 0,
    //         msg: '内部错误请联系管理员！'
    //     });
    //     console.error(
    //         chalk.red('数据库查询错误！')
    //     );
    //     throw err;
    // })
    let result = await userData.findUser(params,
        [{
            path: 'battleInfo'
        },
        {
            path: 'statistics'
        }]
    ).catch((err) => {
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
        let myCard = await userCard.findAndCountUserCard(
            {
                _id: result.userCard,
            },
            20,
            page,
            {
                'cardData.star': -1,
                'cardData._id': -1,
            },
            {
                'cardData.packageId': ObjectId(packageId)
            }
        ).catch((err) => {
            res.send({
                code: 0,
                msg: '内部错误请联系管理员！'
            });
            console.error(
                chalk.red('数据库查询错误！')
            );
            throw err;
        });
        res.send({
            code: 1,
            res: result,
            card: myCard.cardList,
            cardCount: myCard.cardCount,
            md5: result.md5,
            nickName: result.nickName,
            score: result.battleInfo.score,
            level: result.level,
            cardIndexCount: result.statistics.cardIndexCount
        });
    } else {
        res.send({
            code: 0,
            msg: '无该用户信息！'
        });
    }
}