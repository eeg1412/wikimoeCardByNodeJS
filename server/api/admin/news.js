var chalk = require('chalk');
var utils = require('../../utils/utils');
var newsData = require('../../utils/database/news');
var adminUtils = require('../../utils/admin/adminUtils');
module.exports = async function(req, res, next){
    let IP = utils.getUserIp(req);
    let token = req.body.token;
    let _id = req.body.id||-1;
    let type = req.body.type;
    console.info(
        chalk.green('开始增删改新闻,IP为：'+IP)
    )
    if(!token){
        res.send({
            code:402,
            msg:'验证已失效'
        });
        console.info(
            chalk.yellow('token为空,IP为：'+IP)
        )
        return false;
    }
    let result = await adminUtils.checkAdmin(token,IP);
    if(!result){
        res.send({
            code:402,
            msg:'账户信息已失效，请重新登录！'
        });
        console.info(
            chalk.yellow('token解析失败,IP为：'+IP)
        )
        return false;
    }
    if(type==='add'){
        let text = req.body.text;
        let title = req.body.title;
        let time = Math.round(req.body.time);
        let top = req.body.top;
        if(!text||!title||isNaN(time)){
            res.send({
                code:0,
                msg:'参数有误！'
            });
            console.info(
                chalk.yellow('增删改新闻参数有误！,IP为：'+IP)
            )
            return false;
        }
        let params = {
            text:text,
            title:title,
            time:time,
            top:top
        }
        await newsData.saveNews(params).catch(()=>{
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
            msg:'ok'
        });

    }
}