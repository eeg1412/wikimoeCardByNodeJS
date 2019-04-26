var utils = require('../utils/utils');
var userData = require('../utils/database/user');
var md5 = require('md5-node');
var chalk = require('chalk');
module.exports = async function(req, res, next){
    let IP = utils.getUserIp(req);
    let type = req.body.type;
    let goods = req.body.goods;
    let token = req.body.token;
    //先解析token
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
    let tokenDecode = await utils.tokenCheck(token).catch ((err)=>{
        res.send({
            code:403,
            msg:'账户信息已失效，请重新登录！'
        });
        console.info(
            chalk.yellow('登录信息已失效！')
        );
        throw err;
    });
    if(!tokenDecode.email){
        res.send({
            code:403,
            msg:'账户信息已失效，请重新登录！'
        });
        console.info(
            chalk.yellow('登录信息有误！')
        );
        return false;
    }
    let email = tokenDecode.email;
    console.info(
        chalk.green(IP+'的邮箱解析结果为'+email)
    )
    let params = {
        email:email
    }
    let result = await userData.findUser(params).catch ((err)=>{
        res.send({
            code:0,
            msg:'内部错误请联系管理员！'
        });
        console.error(
            chalk.red('数据库查询错误！')
        );
        throw err;
    })
    if(result){
        if((result.token!=token)||(result.token=='')){
            res.send({
                code:403,
                msg:'账户信息已失效，请重新登录！'
            });
            console.info(
                chalk.yellow(email+'和数据库的token对不上,IP为：'+IP)
            );
            return false;
        }
    }else{
        console.info(
            chalk.yellow(email+'邮箱不存在，IP为：'+IP)
        )
        res.send({
            code:403,
            msg:'无该用户信息！'
        });
        return false;
    }
    if(type==0){
        console.info(
            chalk.green(email+'选择的是抽卡类商品，IP为：'+IP)
        )
        //抽卡类商品
        let times = 0;
        let price = 0;
        let card = [];
        let databaseCard = {};
        if(goods==0){
            times = 1;
            price = 30;
        }else if(goods==1){
            times = 10;
            price = 270;
        }else if(goods==2){
            times = 30;
            price = 780;
        }else if(goods==3){
            times = 50;
            price = 1250;
        }else if(goods==4){
            times = 100;
            price = 2400;
        }else{
            res.send({
                code:0,
                msg:'无该商品！'
            });
            return false;
        }
        console.info(
            chalk.green(email+'选择了'+times+'抽，IP为：'+IP)
        )
        if(result.star<price){
            res.send({
                code:0,
                msg:'星星不足！'
            });
            console.info(
                chalk.yellow(email+'的抽卡星星不足抽，IP为：'+IP)
            )
            return false;
        }
        for(let i=0;i<times;i++){
            let rareNum = utils.randomNum(1,100);
            let cardId = utils.wmCreatCardId(rareNum);
            card.push(cardId);
            if(databaseCard['card.'+cardId]){
                databaseCard['card.'+cardId] = databaseCard['card.'+cardId]+1;
            }else{
                databaseCard['card.'+cardId] = 1;
            }  
        }
        databaseCard['star'] = -price;
        let filters = {
            email: email
        }
        console.log(databaseCard);
        let updataParams = {
            $inc:databaseCard,
            ip:IP
        }
        await userData.updataUser(filters,updataParams,true).catch ((err)=>{
            res.send({
                code:0,
                msg:'内部错误请联系管理员！'
            });
            console.error(
                chalk.red('数据库更新错误！')
            );
            throw err;
        })
        let timeNow = Math.round(new Date().getTime()/1000);
        let logObject = {
            email:email,
            md5:md5(email),
            nickName:result.nickName,
            type:'shop_1',
            time:timeNow,
            data:{
                card:card,
                star:price,
                times:times
            },
            ip:IP
        }
        utils.writeLog(logObject);
        console.info(
            chalk.green(email+'成功'+times+'抽，IP为：'+IP)
        )
        res.send({
            code:1,
            data:card,
            msg:'ok'
        });
    }else{
        res.send({
            code:0,
            msg:'无该类型商品！'
        });
        return false;
    }
}