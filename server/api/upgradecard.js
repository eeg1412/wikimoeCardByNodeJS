var utils = require('../utils/utils');
var userbattleinfoData = require('../utils/database/userbattleinfo');
var itemData = require('../utils/database/item.js');
var cardData = require('../data/cardData');
var chalk = require('chalk');
var userData = require('../utils/database/user');

function setChenggolv(v){
    let lv = v;
    let n = 100;
    if(lv<10){
        return n;
    }
    n = 100 - (v + 1 - 10)*5;
    if(n<1){
        n = 1;
    }
    return n;
}
function setItemShould(v){
    if(v==1){
        return 45;
    }else if(v==2){
        return 60;
    }else if(v==3){
        return 30;
    }else if(v==4){
        return 60;
    }else if(v==5){
        return 150;
    }
}
function setCardShould(v){
    if(v<=3){
        return 40;
    }else if(v==4){
        return 13;
    }else if(v==5){
        return 6;
    }else if(v==6){
        return 2;
    }
}

module.exports = async function(req, res, next){
    let IP = utils.getUserIp(req);
    let token = req.body.token;
    let cardId = req.body.cardId;
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
    //检查卡牌是否存在
    let myCardData = cardData['cardData'][utils.PrefixInteger(cardId,4)];
    if(!myCardData){
        res.send({
            code:0,
            msg:'您没有这张卡！'
        });
        console.info(
            chalk.yellow(email+'查询了不存在的卡,IP为：'+IP)
        );
        return false;
    }
    //检查用户是否有卡
    if(!result.card){
        res.send({
            code:0,
            msg:'您还没有卡牌！'
        });
        console.info(
            chalk.yellow(email+'想升级但是没有卡牌,IP为：'+IP)
        );
        return false;
    }
    //检查卡牌是否拥有
    let shouldCardNum = setCardShould(myCardData.star);
    let myCardCount = result.card[cardId] || 0;
    if(myCardCount<=shouldCardNum){
        res.send({
            code:0,
            msg:'您的卡牌不足,快去抽卡吧！'
        });
        console.info(
            chalk.yellow(email+'想升级卡牌，但是卡牌数量不足,IP为：'+IP)
        );
        return false;
    }
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
    let shouldItemId = myCardData.cry + '' + myCardData.leftType;//需要道具信息
    let myItemNum = userItemData[shouldItemId] || 0;
    let shouldItemNum = setItemShould(myCardData.leftType);
    if(myItemNum<shouldItemNum){
        res.send({
            code:0,
            msg:'您的升级道具储量不足,快去挖矿吧！'
        });
        console.info(
            chalk.yellow(email+'想升级卡牌，但是升级道具不足,IP为：'+IP)
        );
        return false;
    }
    //查询卡牌等级
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
    let cardLevel = cardLevelData['cardLevel']||{};//获取卡牌等级
    let myCardLevel = cardLevel[cardId] || 0;
    let chenggongyinzi = utils.randomNum(1,100)//成功率因子
    let chenggonglv = setChenggolv(myCardLevel);//计算成功率
    //删道具
    let itemDataBase = {};
    itemDataBase['item.'+shouldItemId] = -shouldItemNum;
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
    //是否成功
    console.info(
        chalk.green(email+'的升级成功率为'+chenggonglv+'%')
    )
    let isSuccess = chenggongyinzi<=chenggonglv;
    let getStar = 0;
    if(isSuccess){
        //升级
        let cardLvDataBase = {};
        cardLvDataBase['cardLevel.'+cardId] = 1;
        let update = {
            $inc:cardLvDataBase
        };
        await userbattleinfoData.findOneAndUpdate(params,update).catch ((err)=>{
            res.send({
                code:0,
                msg:'内部错误请联系管理员！'
            });
            console.error(
                chalk.red('数据库错误！')
            );
            throw err;
        });
        myCardLevel = myCardLevel+1;
        console.info(
            chalk.green(email+'升级成功，卡牌'+cardId+'升级为'+(myCardLevel)+'级')
        )
    }else{
        //如果失败
        getStar = myCardData.star * shouldCardNum;
        console.info(
            chalk.green(email+'升级失败，卡牌'+cardId+'化作了'+getStar+'颗星星')
        )
    }
    //删卡
    let cardDataBase = {};
    cardDataBase['card.'+cardId] = -shouldCardNum;
    if(getStar>0){
        cardDataBase['star'] = getStar;
    }
    let updataParams = {
        $inc:cardDataBase,
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
        type:'upgradecard',
        time:timeNow,
        data:{
            isSuccess:isSuccess,
            getStar:getStar,
            myCardLevel:myCardLevel,
            cardName:myCardData.name,
            cardId:cardId
        },
        ip:IP
    }
    utils.writeLog(logObject);
    res.send({
        code:1,
        isSuccess:isSuccess,
        getStar:getStar,
        myCardLevel:myCardLevel,
        cardNum:myCardCount-shouldCardNum,
        itemNum:myItemNum-shouldItemNum,
        msg:'ok'
    });
}