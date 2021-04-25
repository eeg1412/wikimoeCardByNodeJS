var utils = require('../utils/utils');
var marketData = require('../utils/database/market');
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
            chalk.yellow('查询结果无该用户,IP为：' + IP)
        );
        return false;
    }
    let email = result.email;
    console.info(
        chalk.green(IP + '的邮箱解析结果为' + email)
    )
    let time = Math.round(new Date().getTime() / 1000);
    const match = {
        time: { $gte: time - 2592000 },
        selled: false,
    }
    const data = await marketData.countByPackageId(match).catch((err) => {
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
        data: data,
        msg: 'ok'
    });
    console.info(
        chalk.green('email:' + email + '查询了市场卡牌统计。IP为：' + IP)
    );
}