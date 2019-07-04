var utils = require('../utils/utils');
var chalk = require('chalk');
var cardData = require('../utils/database/cardData');
module.exports = async function(req, res, next){
    let IP = utils.getUserIp(req);
    let token = req.body.token;
    let packageId = req.body.packageId || 0;
    let type = req.body.type;
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
    if(result){
        let myCard = result.card || {};
        let card = card[packageId];
        if(type == 'cardData' && card){
            let haveCardId = Object.keys(card).map(Number);
            let params = {
                cardId:{$in:haveCardId}
            }
            let myCardData = await cardData.findCardDataMany(params).catch ((err)=>{
                res.send({
                    code:0,
                    msg:'内部错误请联系管理员！'
                });
                console.error(
                    chalk.red('数据库查询错误！')
                );
                throw err;
            });
            card = myCardData;
        }
        card = card || {};
        res.send({
            code:1,
            card:card,
            md5:result.md5,
            nickName:result.nickName,
            score:result.score,
            level:result.level,
            cardIndexCount:result.cardIndexCount
        });
    }else{
        res.send({
            code:403,
            msg:'账户信息已失效，请重新登录！'
        });
        console.info(
            chalk.yellow('查询结果无该用户,IP为：'+IP)
        );
        return false;
    }
}