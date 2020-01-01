var utils = require('../utils/utils');
var marketData = require('../utils/database/market');
var chalk = require('chalk');

module.exports = async function(req, res, next){
    let IP = utils.getUserIp(req);
    let cardId = isNaN(Math.round(req.body.cardId))?0:Math.round(req.body.cardId);
    let token = req.body.token;
    // 判断卡牌ID
    if(!cardId){
        console.info(
            chalk.yellow(IP+'参数有误！')
        )
        res.send({
            code:1,
            msg:'卡牌ID有误！'
        });
        return false;
    }
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
    let time = Math.round(new Date().getTime()/1000);
    let delParmas = {
        time:{$lt:time-5184000},
    }
    // 删除两月前的数据
    await marketData.deletMarketLog(delParmas).catch ((err)=>{
        throw err;
    });
    console.info(
        chalk.green('删除2个月前的市场统计数据成功')
    )
    let parmas = {
        cardId:cardId
    }
    let chartsData = await marketData.findMarketLog(20,1,parmas,{time:-1}).catch ((err)=>{
        res.send({
            code:0,
            msg:'内部错误，更新失败！'
        });
        console.error(
            chalk.red('数据库更新错误！')
        );
        throw err;
    });
    res.send({
        code:1,
        data:chartsData[0],
        msg:'查询成功！'
    });
    console.info(
        chalk.green('email:'+email+'查询了卡牌：'+cardId+'的历史数据。IP为：'+IP)
    );
}