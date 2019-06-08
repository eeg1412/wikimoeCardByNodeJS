var utils = require('../utils/utils');
var userData = require('../utils/database/user');
var chalk = require('chalk');
var itemData = require('../utils/database/item.js');
var itemInfo = require('../data/item.json');

module.exports = async function(req, res, next){
    let IP = utils.getUserIp(req);
    let itemId = req.body.itemId;
    let token = req.body.token;
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
    //查询道具是否存在
    let itemInfo_ = itemInfo[itemId];
    if(!itemInfo_){
        res.send({
            code:0,
            msg:'不存在该道具！'
        });
        console.info(
            chalk.yellow('分解不存在的道具,IP为：'+IP)
        );
        return false;
    }
    itemName = itemInfo_.name;
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
    //查询道具信息
    let params = {
        email:email
    }
    let itemData_ = await itemData.findOne(params).catch ((err)=>{
        res.send({
            code:0,
            msg:'内部错误请联系管理员！'
        });
        console.error(
            chalk.red('数据库错误！')
        );
        throw err;
    }) || {};
    let userItemData = itemData_['item'] || {};//获取道具信息
    let myItemNum = userItemData[itemId] || 0;
    let shouldItemNum = 1000;
    let canGetStar = 270;
    if(myItemNum<shouldItemNum){
        res.send({
            code:0,
            msg:'您的分解道具储量不足,快去挖矿吧！'
        });
        console.info(
            chalk.yellow(email+'分解道具，但是道具不足,IP为：'+IP)
        );
        return false;
    }
    //删道具
    let itemDataBase = {};
    itemDataBase['item.'+itemId] = -shouldItemNum;
    let updataItemParams = {
        $inc:itemDataBase,
    }
    await itemData.findOneAndUpdate(params,updataItemParams).catch ((err)=>{
        res.send({
            code:0,
            msg:'内部错误请联系管理员！'
        });
        console.error(
            chalk.red('数据库错误！')
        );
        throw err;
    })
    //加星星
    let updataParams = {
        $inc:{
            star:canGetStar
        },
        ip:IP
    }
    await userData.updataUser(params,updataParams).catch ((err)=>{
        res.send({
            code:0,
            msg:'内部错误请联系管理员！'
        });
        console.error(
            chalk.red('数据库更新错误！')
        );
        throw err;
    });
    let timeNow = Math.round(new Date().getTime()/1000);
    let logObject = {
        email:email,
        md5:result.md5,
        nickName:result.nickName,
        type:'decItem',
        time:timeNow,
        data:{
            itemName:itemName,
            shouldItemNum:shouldItemNum,
            getStar:canGetStar,
        },
        ip:IP
    }
    utils.writeLog(logObject);
    res.send({
        code:1,
        getStar:canGetStar,
        msg:'ok'
    });
    console.info(
        chalk.green(email+'通过分解道具获得了'+canGetStar+'颗星星，IP为：'+IP)
    )
}