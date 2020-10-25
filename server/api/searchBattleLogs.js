var utils = require('../utils/utils');
var chalk = require('chalk');
var battleLogsData = require('../utils/database/battleLogs');

module.exports = async function (req, res, next) {
    let IP = utils.getUserIp(req);
    let token = req.body.token;
    let page = isNaN(Math.round(req.body.page)) ? 1 : Math.round(req.body.page);
    console.info(
        chalk.green('开始查询战战斗信息,IP为：' + IP)
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
    // let time = Math.round(new Date().getTime() / 1000);
    console.info(
        chalk.green(IP + '的邮箱解析结果为' + email)
    )
    let parmas = {
        // time: { $gte: time - 2592000 },
        $or: [
            { aEmail: email }, { dEmail: email }
        ]
    };
    let battleLogs = await battleLogsData.findBattleLogs(8, 'time data -_id', page, parmas).catch((err) => {
        res.send({
            code: 0,
            msg: '内部错误请联系管理员！'
        });
        console.error(
            chalk.red('数据库查询错误！')
        );
        throw err;
    });
    // let delParmas = {
    //     time: { $lt: time - 604800 },
    // }
    // 删除一周前的数据
    // await battleLogsData.deletBattleLogs(delParmas).catch ((err)=>{
    //     throw err;
    // });
    res.send({
        code: 1,
        data: battleLogs[0],
        total: battleLogs[1],
    });
}