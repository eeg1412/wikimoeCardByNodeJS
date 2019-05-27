var utils = require('../utils/utils');
var wantCardData = require('../utils/database/wantCard');
var chalk = require('chalk');

module.exports = async function(req, res, next){
    let IP = utils.getUserIp(req);
    let token = req.body.token;
    let cardId = req.body.cardId || null;
    let page = isNaN(Math.round(req.body.page))?1:Math.round(req.body.page);
    page = Math.abs(page);
    let pageSize = 5;
    console.info(
        chalk.green('开始查询求购,IP为：'+IP)
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
    let time = Math.round(new Date().getTime()/1000);
    //删除过期的
    let delParams = {
        time:{$lt:time-604800}
    };
    wantCardData.deletWantMany(delParams).catch((err)=>{
        console.error(
            chalk.red('数据库查询错误！')
        );
        throw err;
    });
    if(cardId){
        //查询未过期的
        let params = {
            cardId:cardId,
            time:{$gte:time-604800}
        };
        let getParams ='-__v -_id -email'
        let resault = await wantCardData.findWantCard(pageSize,page,params,getParams).catch((err)=>{
            res.send({
                code:0,
                msg:'内部错误请联系管理员！'
            });
            console.error(
                chalk.red('数据库查询错误！')
            );
            throw err;
        });
        res.send({
            code:1,
            data:resault[0],
            total:resault[1],
            msg:'ok'
        });
    }else{
        let haveCardId = [];
        if(result.card){
            haveCardId = Object.keys(result.card).map(Number);
        }
        let countData = await wantCardData.getGroup(haveCardId);
        res.send({
            code:1,
            data:countData,
            msg:'ok'
        });
    }
}