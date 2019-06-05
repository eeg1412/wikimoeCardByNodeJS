var utils = require('../utils/utils');
var userbattleinfoData = require('../utils/database/userbattleinfo');
var chalk = require('chalk');

module.exports = async function(req, res, next){
    let IP = utils.getUserIp(req);
    let token = req.body.token;
    console.info(
        chalk.green('开始查询卡牌等级,IP为：'+IP)
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
    //查询卡牌等级
    let params = {
        email:email
    }
    let cardLevelData = await userbattleinfoData.findOne(params).catch ((err)=>{
        res.send({
            code:0,
            msg:'内部错误请联系管理员！'
        });
        console.error(
            chalk.red('数据库错误！')
        );
        throw err;
    }) || {};
    let cardLevel = cardLevelData['cardLevel'];
    console.info(
        chalk.green(email+'成功获取了自己的卡牌等级')
    )
    res.send({
        code:1,
        data:cardLevel
    });
}