var utils = require('../utils/utils');
var wantCardData = require('../utils/database/wantCard');
var chalk = require('chalk');
var cardData = require('../utils/database/cardData');
var userData = require('../utils/database/user');

module.exports = async function (req, res, next) {
    let IP = utils.getUserIp(req);
    let cardId = req.body.cardId;
    let price = isNaN(Math.round(req.body.price)) ? 0 : Math.round(req.body.price);
    let captcha = req.body.captcha;
    let token = req.body.token;
    let SK = req.body.secretkey;
    // 判断验证码
    let adminSK_ = false;
    if (SK) {
        adminSK_ = await utils.adminSK(SK);
    }
    if (!adminSK_) {
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
        chalk.green(IP + '的邮箱解析结果为' + email + '开始求购。')
    )
    //验证卡牌是否是有的卡牌
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
            msg: '不存在这张卡牌！'
        });
        console.info(
            chalk.yellow('email:' + email + '没有卡牌：' + cardId + '，不存在。IP为：' + IP)
        );
        return false;
    }
    // 最低价
    let minPrice = utils.checkMinPrice(myCardData.star);
    if (!minPrice) {
        res.send({
            code: 0,
            msg: '无该卡牌！'
        });
        console.info(
            chalk.yellow('email:' + email + '求购不存在的卡牌：' + cardId + '。IP为：' + IP)
        );
        return false;
    }
    if (price < minPrice) {
        res.send({
            code: 0,
            msg: '价格必须超过' + minPrice + '星星！'
        });
        console.info(
            chalk.yellow('email:' + email + '求购价格过低：' + cardId + '。IP为：' + IP)
        );
        return false;
    }
    //验证卡牌是否没有拥有
    // if(result.card[cardId]){
    //     res.send({
    //         code:0,
    //         msg:'你已经拥有这张卡，不能发布求购信息！'
    //     });
    //     console.info(
    //         chalk.yellow('email:'+email+'求购已经拥有的卡牌：'+cardId+'。IP为：'+IP)
    //     );
    //     return false;
    // }
    //发布信息
    let timeNow = Math.round(new Date().getTime() / 1000);
    let params = {
        email: email,
        cardId: cardId
    }
    let upData = {
        email: email,
        nickName: result.nickName,
        md5: result.md5,
        cardId: cardId,
        name: myCardData.name,
        title: myCardData.title,
        star: myCardData.star,
        packageId: myCardData.packageId,
        wantPrice: price,
        time: timeNow,
    }
    await wantCardData.findOneAndUpdate(params, upData).catch((err) => {
        res.send({
            code: 0,
            msg: '内部错误请联系管理员！'
        });
        console.error(
            chalk.red('数据库更新错误！')
        );
        throw err;
    });
    // 更新用户IP
    let filters = {
        email: email
    }
    let updataParams = {
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
    res.send({
        code: 1,
        msg: '发布成功！'
    });
    console.info(
        chalk.green('email:' + email + '求购了卡牌：' + cardId + '，价格为：' + price + '。IP为：' + IP)
    );
}