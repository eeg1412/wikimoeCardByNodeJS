var chalk = require('chalk');
var utils = require('../utils/utils');
var newsData = require('../utils/database/news');
module.exports = async function(req, res, next){
    let IP = utils.getUserIp(req);
    let type = req.body.type;
    let page = isNaN(Math.round(req.body.page))?1:Math.round(req.body.page);
    page = Math.abs(page);
    if(page<=0){
        page = 1;
    }
    let pageSize = 20;
    console.info(
        chalk.green('开始查询新闻,IP为：'+IP)
    )
    let params = {};
    if(type==='top'){
        pageSize = 99;
        page = 1;
        params['top'] = true;
    }
    let resault = await newsData.findNews(pageSize,page,params).catch((err)=>{
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
}