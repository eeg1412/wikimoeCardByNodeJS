var utils = require('../utils/utils');
var userData = require('../utils/database/user');
var marketData = require('../utils/database/market');
var chalk = require('chalk');
var cardData = require('../utils/database/cardData');

module.exports = async function (req, res, next) {
    let IP = utils.getUserIp(req);
    let type = req.body.type;
    let price = isNaN(Math.round(req.body.price)) ? 0 : Math.round(req.body.price);
    let cardId = req.body.cardId;
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
            let oldCaptcha = req.session.captcha;
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
                chalk.yellow('图形验证码有误。' + oldCaptcha + ',结果为' + captcha + '。IP为：' + IP)
            );
            return false;
        }
        await req.session.destroy((err) => {
            if (err) {
                console.info(
                    chalk.red(IP + '验证码清理失败' + '，' + err)
                );
            }
        });
    }
    if (price > 99999999) {
        res.send({
            code: 0,
            msg: '价格超过最大值！'
        });
        console.info(
            chalk.yellow('价格超过最大值。IP为：' + IP)
        );
        return false;
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
        let sort = { 'time': 1 };
        let params = {
            email: email
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
        let time = Math.round(new Date().getTime() / 1000);
        res.send({
            code: 1,
            data: data[0],
            totle: data[1],
            time: time,
            msg: 'ok'
        });
        console.info(
            chalk.green('email:' + email + '查询了自己的上架卡牌。IP为：' + IP)
        );
    } else if (type == 'up') {
        // 上架卡牌
        if (result.cardIndexCount < global.myAppConfig.useMarketCardCount) {
            res.send({
                code: 0,
                msg: '您的卡牌不满' + global.myAppConfig.useMarketCardCount + '种，暂时还不能买卡呢！'
            });
            console.info(
                chalk.yellow('email:' + email + '卡牌不满50种，暂时还不能卖卡。IP为：' + IP)
            );
            return false;
        }
        // 检查该卡牌是否大于1
        let myCard = result.card;
        if (!myCard) {
            res.send({
                code: 0,
                msg: '您没有这张卡牌！'
            });
            console.info(
                chalk.yellow('email:' + email + '没有卡牌：' + cardId + '。IP为：' + IP)
            );
            return false;
        }
        // 获取卡牌数据
        let cardDataParams = {
            cardId: cardId
        }
        let myCardData = await cardData.findCardDataOne(cardDataParams).catch((err) => {
            res.send({
                code: 0,
                msg: '内部错误请联系管理员！'
            });
            console.error(
                chalk.red('数据库查询错误！')
            );
            throw err;
        });
        if (!myCardData) {
            res.send({
                code: 0,
                msg: '您没有这张卡牌！'
            });
            console.info(
                chalk.yellow('email:' + email + '没有卡牌：' + cardId + '，不存在。IP为：' + IP)
            );
            return false;
        }
        // 确保卡牌数量大于1
        let myCardCount = myCard[myCardData.packageId][cardId];
        if (!(myCardCount > 1)) {
            res.send({
                code: 0,
                msg: '卡牌数量不足！'
            });
            console.info(
                chalk.yellow('email:' + email + '没有卡牌：' + cardId + '。IP为：' + IP)
            );
            return false;
        }
        // 检查上架数量是否超过999
        let marketP = {
            email: email
        }
        let myMarket = await marketData.findMarketMany(marketP).catch((err) => {
            res.send({
                code: 0,
                msg: '内部错误，更新失败！'
            });
            console.error(
                chalk.red('数据库更新错误！')
            );
            throw err;
        });
        if (myMarket.length >= 999) {
            res.send({
                code: 0,
                msg: '同时只能上架999张卡牌！'
            });
            console.info(
                chalk.yellow('email:' + email + '上架卡牌过多：' + cardId + '。IP为：' + IP)
            );
            return false;
        }
        let minPrice = utils.checkMinPrice(myCardData.star);
        if (!minPrice) {
            res.send({
                code: 0,
                msg: '无该卡牌！'
            });
            console.info(
                chalk.yellow('email:' + email + '上架不存在的卡牌：' + cardId + '。IP为：' + IP)
            );
            return false;
        }
        if (price < minPrice) {
            res.send({
                code: 0,
                msg: '价格必须超过' + minPrice + '星星！'
            });
            console.info(
                chalk.yellow('email:' + email + '上架价格过低：' + cardId + '。IP为：' + IP)
            );
            return false;
        }
        // 减少卡牌数量
        let cardDataBase = {};
        cardDataBase['card.' + myCardData.packageId + '.' + cardId] = -1;
        let filters = {
            email: email
        }
        let updataParams = {
            $inc: cardDataBase,
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
        // 存入市场
        let time = Math.round(new Date().getTime() / 1000);
        let myCardInfo = myCardData;
        let params = {
            email: email,
            name: myCardInfo.name,
            title: myCardInfo.title,
            star: myCardInfo.star,
            packageId: myCardData.packageId,
            selled: false,
            cardId: Number(cardId),
            price: price,
            time: time
        }
        await marketData.saveMarket(params).catch((err) => {
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
            msg: '上架成功！'
        });
        utils.marketDataCalc(cardId);
        console.info(
            chalk.green('email:' + email + '上架了卡牌：' + cardId + '，价格为：' + price + '。IP为：' + IP)
        );
    } else if (type == 'updateMany') {//一键更新
        let filters = {
            email: email,
            selled: false
        }
        let time = Math.round(new Date().getTime() / 1000);
        let parmas = {
            time: time
        }
        const timeOutFilters = {
            email: email,
            selled: false,
            time: { $lte: time - 2592000 },
        }
        // 查询过期的卡牌
        const timeOutCard = await marketData.findMarketMany(timeOutFilters).catch((err) => {
            res.send({
                code: 0,
                msg: '内部错误，更新失败！'
            });
            console.error(
                chalk.red('数据库更新错误！')
            );
            throw err;
        });
        await marketData.updataMarketMany(filters, parmas).catch((err) => {
            res.send({
                code: 0,
                msg: '内部错误，更新失败！'
            });
            console.error(
                chalk.red('数据库更新错误！')
            );
            throw err;
        });
        timeOutCard.forEach((item, index) => {
            utils.marketDataCalc(item.cardId);
        });
        res.send({
            code: 1,
            price: price,
            time: time,
            msg: '更新成功！'
        });
        console.info(
            chalk.green('email:' + email + '一键更新成功。IP为：' + IP)
        );
    } else if (type == 'update') {
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
        let filters = {
            _id: _id
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
                msg: '无该交易信息！'
            });
            console.info(
                chalk.yellow('email:' + email + '试图更新不存在的卡牌市场。IP为：' + IP)
            );
            return false;
        }
        if (myData.selled) {
            res.send({
                code: 0,
                msg: '已卖出，不能更新！'
            });
            console.info(
                chalk.yellow('email:' + email + '试图更新已卖出的卡牌。IP为：' + IP)
            );
            return false;
        }
        if (myData.email != email) {
            res.send({
                code: 0,
                msg: '不是您的交易信息！'
            });
            console.info(
                chalk.yellow('email:' + email + '试图更新不是自己交易。IP为：' + IP)
            );
            return false;
        }
        let minPrice = utils.checkMinPrice(myData.star);
        if (!minPrice) {
            res.send({
                code: 0,
                msg: '无该卡牌！'
            });
            console.info(
                chalk.yellow('email:' + email + '上架不存在的卡牌：' + myData.cardId + '。IP为：' + IP)
            );
            return false;
        }
        if (price < minPrice) {
            res.send({
                code: 0,
                msg: '价格必须超过' + minPrice + '星星！'
            });
            console.info(
                chalk.yellow('email:' + email + '更新价格过低。IP为：' + IP)
            );
            return false;
        }
        // 更新市场
        let time = Math.round(new Date().getTime() / 1000);
        let parmas = {
            price: price,
            time: time
        }
        await marketData.updataMarket(filters, parmas).catch((err) => {
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
            price: price,
            time: time,
            msg: '更新成功！'
        });
        utils.marketDataCalc(myData.cardId);
        console.info(
            chalk.green('email:' + email + '更新了市场的卡牌，价格为：' + price + '。IP为：' + IP)
        );
    } else if (type == 'down') {
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
        let filters = {
            _id: _id
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
                msg: '无该交易信息！'
            });
            console.info(
                chalk.yellow('email:' + email + '试图更新不存在的卡牌市场。IP为：' + IP)
            );
            return false;
        }
        if (myData.selled) {
            res.send({
                code: 0,
                msg: '已卖出，不能下架！'
            });
            console.info(
                chalk.yellow('email:' + email + '试图更新已卖出的卡牌。IP为：' + IP)
            );
            return false;
        }
        if (myData.email != email) {
            res.send({
                code: 0,
                msg: '不是您的交易信息！'
            });
            console.info(
                chalk.yellow('email:' + email + '试图更新不是自己交易。IP为：' + IP)
            );
            return false;
        }
        let cardId = myData.cardId;
        await marketData.deletMarket(filters).catch((err) => {
            res.send({
                code: 0,
                msg: '内部错误，更新失败！'
            });
            console.error(
                chalk.red('数据库更新错误！')
            );
            throw err;
        });
        let cardDataBase = {};
        console.log(myData.packageId);
        cardDataBase['card.' + myData.packageId + '.' + cardId] = 1;
        let userFilters = {
            email: email
        }
        let updataParams = {
            $inc: cardDataBase,
            ip: IP
        }
        await userData.updataUser(userFilters, updataParams).catch((err) => {
            res.send({
                code: 0,
                msg: '内部错误请联系管理员！'
            });
            console.error(
                chalk.red('数据库更新错误！')
            );
            throw err;
        })
        res.send({
            code: 1,
            msg: '下架成功！'
        });
        utils.marketDataCalc(cardId);
        console.info(
            chalk.green('email:' + email + '下架了卡牌，' + cardId + '。IP为：' + IP)
        );
    } else if (type == 'getstarMany') {
        //筛选已卖出的卡牌
        let filters = {
            email: email,
            selled: true,
        }
        let myData = await marketData.findMarketMany(filters).catch((err) => {
            res.send({
                code: 0,
                msg: '内部错误，更新失败！'
            });
            console.error(
                chalk.red('数据库更新错误！')
            );
            throw err;
        });
        //如果没有已卖出的卡牌
        if (myData.length <= 0) {
            res.send({
                code: 0,
                msg: '您还没有已经卖出的卡牌！'
            });
            console.info(
                chalk.yellow('email:' + email + '还没有已经卖出的卡牌。IP为：' + IP)
            );
            return false;
        }
        let getStar = 0;//获得的星星
        for (let i = 0; i < myData.length; i++) {
            getStar = getStar + Math.floor(myData[i].price * 0.9);
        }
        if ((result.star + getStar) > 99999999) {
            res.send({
                code: 0,
                msg: '您持有的星星太多啦，先消费掉一些吧！'
            });
            console.info(
                chalk.yellow('email:' + email + '的星星太多了！IP为：' + IP)
            );
            return false;
        }
        // 删除数据库信息
        await marketData.deletMarketMany(filters).catch((err) => {
            res.send({
                code: 0,
                msg: '内部错误，更新失败！'
            });
            console.error(
                chalk.red('数据库更新错误！')
            );
            throw err;
        });
        // 拿星星
        let userFilters = {
            email: email
        }
        let updataParams = {
            $inc: {
                star: getStar
            },
            ip: IP
        }
        await userData.updataUser(userFilters, updataParams).catch((err) => {
            res.send({
                code: 0,
                msg: '内部错误请联系管理员！'
            });
            console.error(
                chalk.red('数据库更新错误！')
            );
            throw err;
        })
        res.send({
            code: 1,
            star: getStar,
            msg: '成功领取' + getStar + '颗星星！'
        });
        console.info(
            chalk.green('email:' + email + '成功市场一键领星星，' + getStar + '颗星星。IP为：' + IP)
        );

    } else if (type == 'getstar') {
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
        let filters = {
            _id: _id
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
                msg: '无该交易信息！'
            });
            console.info(
                chalk.yellow('email:' + email + '试图更新不存在的卡牌市场。IP为：' + IP)
            );
            return false;
        }
        if (!myData.selled) {
            res.send({
                code: 0,
                msg: '未卖出，不能领取星星！'
            });
            console.info(
                chalk.yellow('email:' + email + '试图卡牌市场星星，但是还没有卖出去。IP为：' + IP)
            );
            return false;
        }
        if (myData.email != email) {
            res.send({
                code: 0,
                msg: '不是您的交易信息！'
            });
            console.info(
                chalk.yellow('email:' + email + '试图更新不是自己交易。IP为：' + IP)
            );
            return false;
        }
        let getStar = Math.floor(myData.price * 0.9);
        if ((result.star + getStar) > 99999999) {
            res.send({
                code: 0,
                msg: '您持有的星星太多啦，先消费掉一些吧！'
            });
            console.info(
                chalk.yellow('email:' + email + '的星星太多了！IP为：' + IP)
            );
            return false;
        }
        // 删除数据库信息
        await marketData.deletMarket(filters).catch((err) => {
            res.send({
                code: 0,
                msg: '内部错误，更新失败！'
            });
            console.error(
                chalk.red('数据库更新错误！')
            );
            throw err;
        });
        // 拿星星
        let userFilters = {
            email: email
        }
        let updataParams = {
            $inc: {
                star: getStar
            },
            ip: IP
        }
        await userData.updataUser(userFilters, updataParams).catch((err) => {
            res.send({
                code: 0,
                msg: '内部错误请联系管理员！'
            });
            console.error(
                chalk.red('数据库更新错误！')
            );
            throw err;
        })
        res.send({
            code: 1,
            msg: '领取成功！'
        });
        console.info(
            chalk.green('email:' + email + '成功卖卡领取了，' + myData.price + '颗星星。IP为：' + IP)
        );
    } else {
        res.send({
            code: 0,
            msg: '参数有误！'
        });
    }
}