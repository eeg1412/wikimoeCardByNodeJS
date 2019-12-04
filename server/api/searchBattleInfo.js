var utils = require('../utils/utils');
var chalk = require('chalk');
var userbattleinfoData = require('../utils/database/userbattleinfo');

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

    // 获取对战次数结算
    const dataChanceData = utils.battleChance(result);

    // 计算当天战斗次数
    let battleOverTimes = 6;//每天最多可以赢几次
    let dailyBattleTime = Number(dataChanceData.dataTime);
    let myBattleTimes = dataChanceData.battleChance;//战斗次数
    //查询胜负信息
    let userbattleinfoData_ = await userbattleinfoData.findOne({email:email},'-_id lose win draw battleScoreHistory').catch ((err)=>{
        res.send({
            code:0,
            msg:'内部错误请联系管理员！'
        });
        console.error(
            chalk.red('数据库错误！')
        );
        throw err;
    });
    res.send({
        code:1,
        battleOverTimes:battleOverTimes,
        myBattleTimes:myBattleTimes,
        dailyBattleTime:dailyBattleTime,
        userbattleinfoData:userbattleinfoData_,
        score:result.score
    });
}