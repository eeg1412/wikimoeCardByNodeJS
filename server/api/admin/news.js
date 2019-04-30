var chalk = require('chalk');
var utils = require('../../utils/utils');
var newsData = require('../../utils/database/news');
var adminUtils = require('../../utils/admin/adminUtils');
module.exports = async function(req, res, next){
    let IP = utils.getUserIp(req);
    let token = req.body.token;
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
    let resultAdmin = await adminUtils.checkAdmin(token,IP);
    if(!resultAdmin){
        res.send({
            code:402,
            msg:'账户信息已失效，请重新登录！'
        });
        console.info(
            chalk.yellow('token解析失败,IP为：'+IP)
        )
        return false;
    }
    let adminAccount = resultAdmin.account;
    if(type==='add'){
        console.info(
            chalk.green(adminAccount+'开始增新闻,IP为：'+IP)
        )
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
        await newsData.saveNews(params).catch((err)=>{
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
        console.info(
            chalk.green(adminAccount+'增新闻成功,IP为：'+IP)
        )
        let logObj = {
            text:'使用管理员账号'+adminAccount+'增加了新闻。《'+params.title+'》',
            ip:IP
        }
        adminUtils.adminWriteLog(logObj);
    }else if(type==='get'){
        console.info(
            chalk.green(adminAccount+'开始获取新闻,IP为：'+IP)
        )
        let _id = req.body._id;
        let params = {
            _id:_id
        }
        let resault = await newsData.findNewsOne(params).catch((err)=>{
            res.send({
                code:0,
                msg:'内部错误或者新闻ID有误！'
            });
            console.error(
                chalk.red(err)
            );
            return false;
        });
        if(!resault){
            res.send({
                code:0,
                msg:'无该文章！'
            });
            return false;
        }
        res.send({
            code:1,
            data:resault,
            msg:'ok'
        });
        console.info(
            chalk.green(adminAccount+'获取新闻成功,IP为：'+IP)
        )
    }else if(type==='edit'){
        console.info(
            chalk.green(adminAccount+'开始改新闻,IP为：'+IP)
        )
        let _id = req.body._id;
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
            _id:_id
        }
        let resault = await newsData.findNewsOne(params).catch((err)=>{
            res.send({
                code:0,
                msg:'内部错误或者新闻ID有误！'
            });
            console.error(
                chalk.red(err)
            );
            return false;
        });
        if(!resault){
            res.send({
                code:0,
                msg:'无该文章！'
            });
            return false;
        }
        let params_ = {
            text:text,
            title:title,
            time:time,
            top:top
        }
        await newsData.updataNews(params,params_).catch((err)=>{
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
        let logObj = {
            text:'使用管理员账号'+adminAccount+'修改了新闻。《'+params_.title+'》',
            ip:IP
        }
        adminUtils.adminWriteLog(logObj);
        console.info(
            chalk.green(adminAccount+'改新闻成功,IP为：'+IP)
        )
    }else if(type==='del'){
        console.info(
            chalk.green(adminAccount+'开始删除新闻,IP为：'+IP)
        )
        let _id = req.body._id;
        let params = {
            _id:_id
        }
        let resault = await newsData.findNewsOne(params).catch((err)=>{
            res.send({
                code:0,
                msg:'内部错误或者新闻ID有误！'
            });
            console.error(
                chalk.red(err)
            );
            return false;
        });
        if(!resault){
            res.send({
                code:0,
                msg:'无该文章！'
            });
            return false;
        }
        await newsData.deletNews(params).catch((err)=>{
            res.send({
                code:0,
                msg:'内部错误或者新闻ID有误！'
            });
            console.error(
                chalk.red(err)
            );
            return false;
        });
        res.send({
            code:1,
            msg:'ok'
        });
        
        let logObj = {
            text:'使用管理员账号'+adminAccount+'删除了新闻《'+resault.title+'》',
            ip:IP
        }
        adminUtils.adminWriteLog(logObj);
        console.info(
            chalk.green(adminAccount+'删除新闻成功,IP为：'+IP)
        )
    }else{
        res.send({
            code:0,
            msg:'参数有误！'
        });
        let logObj = {
            text:'使用管理员账号'+adminAccount+'使用了不正确的新闻参数！',
            ip:IP
        }
        adminUtils.adminWriteLog(logObj);
        console.info(
            chalk.green(adminAccount+'参数有误,IP为：'+IP)
        )
    }
}