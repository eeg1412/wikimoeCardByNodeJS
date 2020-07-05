var utils = require('../utils/utils');
var wantCardData = require('../utils/database/wantCard');
var chalk = require('chalk');

module.exports = async function (req, res, next) {
    let IP = utils.getUserIp(req);
    let token = req.body.token;
    let type = req.body.type;
    let cardId = req.body.cardId || null;
    let page = isNaN(Math.round(req.body.page)) ? 1 : Math.round(req.body.page);
    page = Math.abs(page);
    if (page <= 0) {
        page = 1;
    }
    let pageSize = 5;
    console.info(
        chalk.green('开始查询求购,IP为：' + IP)
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
    let time = Math.round(new Date().getTime() / 1000);
    //删除过期的
    let delParams = {
        time: { $lt: time - 259200 }
    };
    wantCardData.deletWantMany(delParams).catch((err) => {
        console.error(
            chalk.red('数据库查询错误！')
        );
        throw err;
    });
    if (type === 'search') {
        let star = isNaN(Math.round(req.body.star)) ? 0 : Math.round(req.body.star);
        let isMy = req.body.my;
        const packageId = req.body.packageId || "-1";
        pageSize = 10;
        //查询未过期的
        let params = {
            time: { $gte: time - 259200 }
        };
        if (star) {
            params['star'] = star;
        }
        if (isMy === "1") {
            params['email'] = email;
        } else {
            params['email'] = { $nin: [email] };
        }
        if (packageId != "-1") {
            params['packageId'] = packageId;
        }
        let getParams = '-__v -_id -email'
        let resault = await wantCardData.findWantCard(pageSize, page, params, getParams).catch((err) => {
            res.send({
                code: 0,
                msg: '内部错误请联系管理员！'
            });
            console.error(
                chalk.red('数据库查询错误！')
            );
            throw err;
        });
        let myCardList = {};
        resault[0].forEach((item) => {
            const itemCardId = item.cardId;
            const itemPackageId = item.packageId;
            try {
                const cardCount = result.card[itemPackageId][itemCardId] || 0;
                myCardList[itemCardId] = cardCount;
            }
            catch (e) {
                myCardList[itemCardId] = 0;
            }
        });
        res.send({
            code: 1,
            myCardList: myCardList,
            data: resault[0],
            total: resault[1],
            msg: 'ok'
        });
    } else if (cardId) {
        //查询未过期的
        let params = {
            cardId: cardId,
            time: { $gte: time - 604800 }
        };
        let getParams = '-__v -_id -email'
        let resault = await wantCardData.findWantCard(pageSize, page, params, getParams).catch((err) => {
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
            data: resault[0],
            total: resault[1],
            msg: 'ok'
        });
    } else {
        let haveCardId = [];
        let packageId = req.body.packageId || '0';
        if (result.card) {
            haveCardId = Object.keys(result.card[packageId] || {});//.map(Number);
        }
        let countData = await wantCardData.getGroup(haveCardId);
        res.send({
            code: 1,
            data: countData,
            msg: 'ok'
        });
    }
}