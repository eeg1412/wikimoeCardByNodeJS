var utils = require('../utils/utils');
var dailyData = require('../utils/database/userDaliyGetItem');
var chalk = require('chalk');

module.exports = async function(req, res, next){
    let IP = utils.getUserIp(req);
    let token = req.body.token;
    //解析token
    if(!token){
        console.info(
            chalk.yellow(IP+'参数有误！')
        )
        res.send({
            code:2,
            msg:'token为空！'
        });
        return false;
    }
    let result = await utils.tokenCheckAndEmail(token).catch ((err)=>{
        throw err;
    });
    if(!result){
        res.send({
            code:2,
            msg:'账户信息已失效，请重新登录！'
        });
        console.info(
            chalk.yellow('签到菜单查询结果无该用户,IP为：'+IP)
        );
        return false;
    }
    let email = result.email;
    console.info(
        chalk.green(IP+'的邮箱解析结果为'+email)
    )
    //查询用户信息
    let params = {
        email:email
    }
    let getInfo = '-_id -email';
    let userDailyInfo = await dailyData.findOne(params,getInfo).catch ((err)=>{
        res.send({
            code:0,
            msg:'内部错误请联系管理员！'
        });
        console.error(
            chalk.red('数据库错误！')
        );
        throw err;
    }) || {};
    let lastGetTime = Number(userDailyInfo['time'])*1000 || 0;
    //判断上次签到是不是本月的
    let geted = false;
    //判断今天是不是已经签到过了
    let timeNow = new Date();
    if(timeNow.toDateString()===new Date(lastGetTime).toDateString()){
        geted = true;
    }

    let nextTime = new Date();
    nextTime.setDate(nextTime.getDate() + 1);
    let stringTime = nextTime.getFullYear() + '-' + (nextTime.getMonth() + 1) + '-' + (nextTime.getDate()) + ' 0:0:0'
    res.send({
        code:1,
        geted:geted,
        nextTime:Date.parse(new Date(stringTime)),
        msg:'ok'
    });
    console.info(
        chalk.green('email:'+email+'查询每日签到成功。IP为：'+IP)
    );

}