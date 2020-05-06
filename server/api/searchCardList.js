var utils = require('../utils/utils');
var chalk = require('chalk');
var cardData = require('../utils/database/cardData');
var userbattleinfoData = require('../utils/database/userbattleinfo');
const userCard = require('../utils/database/userCard');
const validator = require('validator');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
module.exports = async function (req, res, next) {
    const IP = utils.getUserIp(req);
    const token = req.body.token;
    const page = Number(req.body.page) || 1;
    const id = req.body.id;

    if (!validator.isMongoId(id + '')) {
        console.info(
            chalk.yellow(IP + '参数有误！')
        )
        res.send({
            code: 0,
            msg: '参数有误！'
        });
        return false;
    }
    if (!validator.isInt(page + '', { min: 1 })) {
        page = 1;
    }
    console.info(
        chalk.green('开始查询卡牌,IP为：' + IP)
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
    if (result) {
        let total = 0;
        let params = {
            "cardList.cardID": ObjectId(id)
        }

        let myCard = await userCard.findUserCard(
            {
                _id: result.userCard,
            },
            20,
            page,
            {
                'cardData.isSparkle': -1,
                'cardData.isBattle': -1,
                'cardData.cardLevel': -1,
                'cardData._id': -1,
            },
            params

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
            myCardList: myCard,
            total: total
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