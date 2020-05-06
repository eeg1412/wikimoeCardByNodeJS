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
    const title = req.body.title + "";
    const name = req.body.name + "";
    const have = Number(req.body.have);
    // 参数检查
    const starReg = /^[0-6]{1}$/
    const ltReg = /^[0-5]{1}$/
    const rtReg = /^[0-7]{1}$/
    const cryReg = /^[0-5]{1}$/
    const haveReg = /^[0-2]{1}$/
    if (!starReg.test(star + "") || !ltReg.test(leftType + "") || !rtReg.test(rightType + "") || !cryReg.test(cry + "") || !haveReg.test(have + "")) {
        console.info(
            chalk.yellow(IP + '参数有误！')
        )
        res.send({
            code: 0,
            msg: '参数有误！'
        });
        return false;
    }
    if (title.length > 255 || name.length > 255) {
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

        if (have === 1) {
            params["cardData.disabled"] = false;
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
        } else if (have === 2) {
            params["cardData.disabled"] = false;
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
            let ninList = [];
            myCard.cardList.forEach((item) => {
                ninList.push(item.cardData._id);
            });

            params = {};
            params["disabled"] = false;
            params["_id"] = {
                $nin: ninList
            };
            if (validator.isMongoId(packageId + '')) {
                params["packageId"] = packageId;
            }
            if (star > 0) {
                params['star'] = star;
            }
            if (cry > 0) {
                params['cry'] = cry;
            }
            if (rightType > 0) {
                params['rightType'] = rightType;
            }
            if (leftType > 0) {
                params['leftType'] = leftType;
            }
            if (title) {
                const titleReg = new RegExp(title, 'i');
                params['title'] = { $regex: titleReg };
            }
            if (name) {
                const nameReg = new RegExp(name, 'i');
                params['name'] = { $regex: nameReg };
            }
            let myCardData = await cardData.findCardData(20, page, params, { star: -1, _id: -1 }).catch((err) => {
                res.send({
                    code: 0,
                    msg: '内部错误请联系管理员！'
                });
                console.error(
                    chalk.red('数据库查询错误！')
                );
                throw err;
            });
            card = myCardData[0];
            total = myCardData[1];

        } else {
            params["disabled"] = false;
            if (validator.isMongoId(packageId + '')) {
                params["packageId"] = packageId;
            }
            if (star > 0) {
                params['star'] = star;
            }
            if (cry > 0) {
                params['cry'] = cry;
            }
            if (rightType > 0) {
                params['rightType'] = rightType;
            }
            if (leftType > 0) {
                params['leftType'] = leftType;
            }
            if (title) {
                const titleReg = new RegExp(title, 'i');
                params['title'] = { $regex: titleReg };
            }
            if (name) {
                const nameReg = new RegExp(name, 'i');
                params['name'] = { $regex: nameReg };
            }
            let myCardData = await cardData.findCardData(20, page, params, { star: -1, _id: -1 }).catch((err) => {
                res.send({
                    code: 0,
                    msg: '内部错误请联系管理员！'
                });
                console.error(
                    chalk.red('数据库查询错误！')
                );
                throw err;
            });
            card = myCardData[0];
            total = myCardData[1];
            // 查询本页的用户卡牌
            let pageCardList = [];
            myCardData[0].forEach((element) => {
                pageCardList.push(element._id);
            });

            myCardList = await userCard.findByHandBook({
                _id: result.userCard
            }, pageCardList).catch((err) => {
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