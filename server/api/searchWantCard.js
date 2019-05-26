var utils = require('../utils/utils');
var wantCardData = require('../utils/database/wantCard');
var chalk = require('chalk');

module.exports = async function(req, res, next){
    let IP = utils.getUserIp(req);
    let cardId = req.body.cardId;
    let page = isNaN(Math.round(req.body.page))?1:Math.round(req.body.page);
    page = Math.abs(page);
    let pageSize = 5;
    console.info(
        chalk.green('开始查询求购,IP为：'+IP)
    )
    let time = Math.round(new Date().getTime()/1000);
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
}