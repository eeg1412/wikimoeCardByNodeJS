var utils = require('../utils/utils');
var userbattleinfoData = require('../utils/database/userbattleinfo');
var itemData = require('../utils/database/item.js');
var cardData = require('../data/cardData');
var chalk = require('chalk');
var userData = require('../utils/database/user');

function setChenggolv(v){
    let lv = v;
    let n = 100;
    if(lv<5){
        return n;
    }
    n = 100 - (v + 1 - 5)*5;
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
    let shouldCard = 0;
        switch(v) {
        case 1:
            shouldCard = 3;
            break;
        case 2:
            shouldCard = 3;
            break;
        case 3:
            shouldCard = 15;
            break;
        case 4:
            shouldCard = 5;
            break;
        case 5:
            shouldCard = 3;
            break;
        case 6:
            shouldCard = 1;
            break;
    }
    return shouldCard;
}

module.exports = async function(req, res, next){
    let IP = utils.getUserIp(req);
    let token = req.body.token;
    let cardId = req.body.cardId;
    let usePieces = req.body.usePieces;
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
    if(result.card[cardId]<=0){
        res.send({
            code:0,
            msg:'您没有这张卡！'
        });
        console.info(
            chalk.yellow(email+'查询了自己没拥有的卡,IP为：'+IP)
        );
        return false;
    }
    //是否有足够数量的卡
    if((myCardCount<=shouldCardNum)&&!usePieces){
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
            msg:'您的升级材料储量不足,快去挖矿吧！'
        });
        console.info(
            chalk.yellow(email+'想升级卡牌，但是升级道具不足,IP为：'+IP)
        );
        return false;
    }
    // 卡牌所需碎片ID
    const ItemList = {
        "1":"101",
        "2":"102",
        "3":"103",
        "4":"104",
        "5":"105",
        "6":"106"
    };
    //删卡数据库
    let cardDataBase = {};
    cardDataBase['card.'+cardId] = -shouldCardNum;
    let shouldPieces = 0;//需要多少碎片
    let pieceId = ItemList[myCardData.star];//碎片ID
    let myPieces = userItemData[pieceId] || 0;//碎片数量
    let itemDataBase = {};//删除的道具
    if(usePieces){
        let cardCha = shouldCardNum-myCardCount+1;//还差多少张卡
        if(cardCha>0){
            shouldPieces = cardCha*3;
            if(myPieces<shouldPieces){//如果碎片不够
                res.send({
                    code:0,
                    msg:'您的卡牌碎片不足,可以从分解卡牌中获得！'
                });
                console.info(
                    chalk.yellow(email+'想升级卡牌，但是碎片不足,IP为：'+IP)
                );
                return false;
            }
            itemDataBase['item.'+pieceId] = -shouldPieces;
            cardDataBase['card.'+cardId] = -(shouldCardNum - cardCha);
        }

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
    //安全起见再对比下卡牌是否超过了拥有的卡牌数量
    if(myCardCount<=Math.abs(cardDataBase['card.'+cardId])){
        res.send({
            code:0,
            msg:'您的升级卡牌不足,快去挖矿吧！'
        });
        console.info(
            chalk.yellow(email+'想升级卡牌，但是升级卡牌不足,IP为：'+IP)
        );
        return false;
    }
    let cardLevel = cardLevelData['cardLevel']||{};//获取卡牌等级
    let myCardLevel = cardLevel[cardId] || 0;
    let chenggongyinzi = utils.randomNum(1,100)//成功率因子
    let chenggonglv = setChenggolv(myCardLevel);//计算成功率
    //删道具数据库操作
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
        getStar = myCardData.star * Math.abs(cardDataBase['card.'+cardId]);
        console.info(
            chalk.green(email+'升级失败，卡牌'+cardId+'化作了'+getStar+'颗星星')
        )
    }
    //操作删卡
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
        cardNum:myCardCount+cardDataBase['card.'+cardId],
        itemNum:myItemNum-shouldItemNum,
        myPieces:myPieces+itemDataBase['item.'+pieceId],
        pieceId:pieceId,
        msg:'ok'
    });
}