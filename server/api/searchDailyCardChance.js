var utils = require('../utils/utils');
var chalk = require('chalk');
module.exports = async function (req, res, next) {
    let IP = utils.getUserIp(req);
    let token = req.body.token;
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
            chalk.yellow('查询结果token无效,IP为：' + IP)
        );
        return false;
    }
    let email = result.email;
    console.info(
        chalk.green(IP + '的邮箱解析结果为' + email)
    )
    let dailyCard = result.dailyCard;
    let dailyCardTime = Math.round(Number(result.dailyCardTime) * 1000);
    let timeNow = Math.round(new Date().getTime() / 1000);
    let myDailyChance = global.myAppConfig.dailyChance;
    if (new Date(timeNow * 1000).toDateString() === new Date(dailyCardTime).toDateString()) {//如果是同天
        if (dailyCard >= myDailyChance) {
            res.send({
                code: 1,
                leftGetChance: 0,
                msg: 'ok'
            });
            return false;
        }
    } else {
        dailyCard = 0;
    }

    res.send({
        code: 1,
        leftGetChance: myDailyChance - dailyCard,
        msg: 'ok'
    });
}