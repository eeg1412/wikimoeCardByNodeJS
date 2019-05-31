var utils = require('../utils/utils');
var chalk = require('chalk');

module.exports = async function(req, res, next){
    let IP = utils.getUserIp(req);
    let token = req.body.token;
    console.info(
        chalk.green('开始查询战斗信息,IP为：'+IP)
    )
    //解析token
    if(!token){
        console.info(
            chalk.yellow(IP+'参数有误！')
        )
        res.send({
            code:403,
            msg:'token为空！'
        });
        return false;
    }
    let result = await utils.tokenCheckAndEmail(token).catch ((err)=>{
        throw err;
    });
    if(!result){
        res.send({
            code:403,
            msg:'账户信息已失效，请重新登录！'
        });
        console.info(
            chalk.yellow('查询结果无该用户,IP为：'+IP)
        );
        return false;
    }
    let email = result.email;
    console.info(
        chalk.green(IP+'的邮箱解析结果为'+email)
    )
    // 计算当天战斗次数
    let battleOverTimes = 5;//每天最多可以赢几次
    let dailyBattleTime = Math.round(Number(result.battleStamp)*1000);
    let myBattleTimes = result.battleDailyCount;//战斗次数
    if(!(new Date().toDateString()===new Date(dailyBattleTime).toDateString())){//如果不是同天
        myBattleTimes = 0;
    }
    res.send({
        code:1,
        battleOverTimes:battleOverTimes,
        myBattleTimes:myBattleTimes
    });
}