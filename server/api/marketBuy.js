var utils = require('../utils/utils');
var userData = require('../utils/database/user');
var marketData = require('../utils/database/market');
var chalk = require('chalk');

module.exports = async function (req, res, next) {
    let IP = utils.getUserIp(req);
    let type = req.body.type;
    let _id = req.body.id;
    let captcha = req.body.captcha;
    let token = req.body.token;
    let SK = req.body.secretkey;
    // 判断验证码
    let adminSK_ = false;
    if (SK) {
        adminSK_ = await utils.adminSK(SK);
    }
    if (!adminSK_ && type !== 'search') {
        if (req.session.captcha != captcha || !captcha) {
            await req.session.destroy((err) => {
                if (err) {
                    console.info(
                        chalk.red(IP + '验证码清理失败' + '，' + err)
                    );
                }
            })
            res.send({
                code: 0,
                msg: '验证码有误，或者已经过期！'
            });
            console.info(
                chalk.yellow('图形验证码有误。IP为：' + IP)
            );
            return false;
        }
        await req.session.destroy((err) => {
            if (err) {
                console.info(
                    chalk.red(IP + '验证码清理失败' + '，' + err)
                );
            }
        })
    }
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
    if (type == 'search') {
        let page = isNaN(Math.round(req.body.page)) ? 1 : Math.round(req.body.page);
        page = Math.abs(page);
        if (page <= 0) {
            page = 1;
        }
        let name = req.body.name || '';
        let text = req.body.text || '';
        let have = req.body.have || '';
        let packageId = req.body.packageId || '0';
        let star = isNaN(Math.round(req.body.star)) ? 0 : Math.round(req.body.star);
        let sortType = isNaN(Math.round(req.body.sort)) ? 0 : Math.round(req.body.sort);
        let time = Math.round(new Date().getTime() / 1000);
        let haveCardId = [];
        let params = {
            time: { $gte: time - 2592000 },
            selled: false,
            packageId: packageId
        }
        let baseCard = result.card || {}
        let myCardObj = baseCard[packageId];
        if (have == '1') {
            if (myCardObj) {
                haveCardId = Object.keys(myCardObj).map(Number);
            }
            params['cardId'] = { $in: haveCardId };
        } else if (have == '2') {
            if (myCardObj) {
                haveCardId = Object.keys(myCardObj).map(Number);
            }
            params['cardId'] = { $nin: haveCardId };
        }
        let sort = { 'star': -1, 'cardId': -1, 'price': 1 };
        if (name === 'name' || name === 'title') {
            const reg = new RegExp(text, 'i');
            params[name] = { $regex: reg };
        } else if (name === 'cardId') {
            if (text) {
                params[name] = isNaN(Math.floor(text)) ? 0 : Math.floor(text);
            }
        }
        if (star) {
            params['star'] = star;
        }
        if (sortType == 1) {
            sort = { 'price': 1 };
        } else if (sortType == 2) {
            sort = { 'price': -1 };
        } else if (sortType == 3) {
            sort = { 'star': 1 };
        } else if (sortType == 4) {
            sort = { 'star': -1 };
        }
        let data = await marketData.findMarket(20, page, params, sort, '-__v -email').catch((err) => {
            res.send({
                code: 0,
                msg: '内部错误，更新失败！'
            });
            console.error(
                chalk.red('数据库更新错误！')
            );
            throw err;
        });
        res.send({
            code: 1,
            data: data[0],
            totle: data[1],
            msg: 'ok'
        });
        console.info(
            chalk.green('email:' + email + '查询了市场卡牌。IP为：' + IP)
        );
    } else if (type == 'buy') {
        if (!utils.objectIDCheck(_id)) {
            res.send({
                code: 0,
                msg: '参数有误！'
            });
            console.info(
                chalk.yellow('email:' + email + '使用了不正确的数据库ID。IP为：' + IP)
            );
            return false;
        }
        if (result.cardIndexCount < global.myAppConfig.useMarketCardCount) {
            res.send({
                code: 0,
                msg: '您的卡牌不满' + global.myAppConfig.useMarketCardCount + '种，暂时还不能买卡呢！'
            });
            console.info(
                chalk.yellow('email:' + email + '卡牌不满50种，暂时还不能买卡。IP为：' + IP)
            );
            return false;
        }
        // 查询未过期卡牌交易
        let time = Math.round(new Date().getTime() / 1000);
        let filters = {
            _id: _id,
            time: { $gte: time - 2592000 }
        }
        let myData = await marketData.findMarketOne(filters).catch((err) => {
            res.send({
                code: 0,
                msg: '内部错误，更新失败！'
            });
            console.error(
                chalk.red('数据库更新错误！')
            );
            throw err;
        });
        if (!myData) {
            res.send({
                code: 0,
                msg: '卡牌不存在，或者被人抢先购买啦！'
            });
            console.info(
                chalk.yellow('email:' + email + '试图购买不存在的卡牌市场。IP为：' + IP)
            );
            return false;
        }
        if (myData.selled) {
            res.send({
                code: 0,
                msg: '卡牌被人抢先购买啦！'
            });
            console.info(
                chalk.yellow('email:' + email + '买卡买迟了。IP为：' + IP)
            );
            return false;
        }
        if (result.star < myData.price) {
            res.send({
                code: 0,
                msg: '您的星星不足！'
            });
            console.info(
                chalk.yellow('email:' + email + '想买卡但是星星不足。IP为：' + IP)
            );
            return false;
        }
        // 减少用户的星星并增加卡牌
        let starCard = {
            star: -myData.price
        }
        starCard['card.' + myData.packageId + '.' + myData.cardId] = 1;
        let userFilters = {
            email: email
        }
        let updataParams = {
            $inc: starCard,
            ip: IP
        }
        await userData.updataUser(userFilters, updataParams, true).catch((err) => {
            res.send({
                code: 0,
                msg: '内部错误请联系管理员！'
            });
            console.error(
                chalk.red('数据库更新错误！')
            );
            throw err;
        })
        // 更新市场
        let parmas = {
            selled: true
        }
        let filters_ = {
            _id: _id,
        }
        await marketData.updataMarket(filters_, parmas).catch((err) => {
            res.send({
                code: 0,
                msg: '内部错误，更新失败！'
            });
            console.error(
                chalk.red('数据库更新错误！')
            );
            throw err;
        });
        res.send({
            code: 1,
            msg: '购买成功！'
        });
        utils.marketDataCalc(myData.cardId);
        let logObject = {
            email: email,
            md5: result.md5,
            nickName: result.nickName,
            type: 'marketBuy',
            time: time,
            data: {
                price: myData.price,
                cardId: myData.cardId,
                title: myData.title,
                name: myData.name,
                star: myData.star,
                packageId: myData.packageId,
            },
            ip: IP
        }
        utils.writeLog(logObject);
        console.info(
            chalk.green('email:' + email + '购买了卡牌。IP为：' + IP)
        );
    } else {
        res.send({
            code: 1,
            msg: '参数有误！'
        });
    }
}