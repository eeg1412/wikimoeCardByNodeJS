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
    const packageId = req.body.packageId;
    const page = Number(req.body.page) || 1;
    const star = Number(req.body.star);
    const leftType = Number(req.body.leftType);
    const rightType = Number(req.body.rightType);
    const cry = Number(req.body.cry);
    const title = req.body.title || "";
    const name = req.body.name || "";
    const isSparkle = req.body.isSparkle || "0";
    const isBattle = req.body.isBattle || "0";
    const isSell = req.body.isSell || "0";
    const disabled = req.body.disabled || "2";

    // 参数检查
    const starReg = /^[0-6]{1}$/
    const ltReg = /^[0-5]{1}$/
    const rtReg = /^[0-7]{1}$/
    const cryReg = /^[0-5]{1}$/
    const isReg = /^[0-2]{1}$/
    if (!starReg.test(star + "") || !ltReg.test(leftType + "") || !rtReg.test(rightType + "") || !cryReg.test(cry + "") || !isReg.test(isSparkle + "") || !isReg.test(isBattle + "") || !isReg.test(isSell + "") || !isReg.test(disabled + "")) {
        console.info(
            chalk.yellow(IP + '参数有误！')
        )
        res.send({
            code: 0,
            msg: '参数有误！'
        });
        return false;
    }
    if ((title + "").length > 255 || (name + "").length > 255) {
        console.info(
            chalk.yellow(IP + '角色名或者作品名字数过多！')
        )
        res.send({
            code: 0,
            msg: '角色名或者作品名字数过多！'
        });
        return false;
    }
    if (!validator.isInt(page + '', { min: 1 })) {
        page = 1;
    }
    console.info(
        chalk.green('开始查询卡牌图鉴,IP为：' + IP)
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
        let card = [];
        let myCardList = [];
        let total = 0;
        let params = {
        }
        if (disabled === "1") {
            params["cardData.disabled"] = true;
        } else if (disabled === "2") {
            params["cardData.disabled"] = false;
        }

        // 包含闪卡则isSparkle应该取大于0
        // isBattle增加计数
        // isSell增加计数

        // if (isSparkle === "1") {
        //     params["isSparkle"] = true;
        // } else if (isSparkle === "2") {
        //     params["isSparkle"] = false;
        // }

        // if (isBattle === "1") {
        //     params["isBattle"] = true;
        // } else if (isBattle === "2") {
        //     params["isBattle"] = false;
        // }

        // if (isSell === "1") {
        //     params["isSell"] = true;
        // } else if (isSell === "2") {
        //     params["isSell"] = false;
        // }

        if (validator.isMongoId(packageId + '')) {
            params["cardData.packageId"] = ObjectId(packageId);
        }
        if (star > 0) {
            params['cardData.star'] = star;
        }
        if (cry > 0) {
            params['cardData.cry'] = cry;
        }
        if (rightType > 0) {
            params['cardData.rightType'] = rightType;
        }
        if (leftType > 0) {
            params['cardData.leftType'] = leftType;
        }
        if (title) {
            const titleReg = new RegExp(title, 'i');
            params['cardData.title'] = { $regex: titleReg };
        }
        if (name) {
            const nameReg = new RegExp(name, 'i');
            params['cardData.name'] = { $regex: nameReg };
        }
        console.log(params)
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
        myCard.cardList.forEach((item) => {
            card.push(item.cardData);
            const myCardListItem = {
                count: item.count,
                isSparkle: item.isSparkle,
                _id: item._id,
                cardID: item.cardID,
            }
            myCardList.push(myCardListItem);
        });
        total = myCard.cardCount;

        res.send({
            code: 1,
            card: card,
            md5: result.md5,
            nickName: result.nickName,
            score: result.score,
            level: result.level,
            myCardList: myCardList,
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