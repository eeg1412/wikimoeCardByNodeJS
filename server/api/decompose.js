var utils = require('../utils/utils');
var userData = require('../utils/database/user');
var chalk = require('chalk');
var cardData = require('../utils/database/cardData');
var itemDatabase = require('../utils/database/item');

module.exports = async function(req, res, next){
    let IP = utils.getUserIp(req);
    let cardId = req.body.cardId;
    let cardCount = req.body.cardCount;
    let packageId = req.body.packageId || '0';
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
    // 检查改卡牌是否大于1
    let myCard = result.card[packageId];
    if(!myCard){
        res.send({
            code:0,
            msg:'您没有可分解的卡牌！'
        });
        console.info(
            chalk.yellow('email:'+email+'没有卡牌：'+cardId+'。IP为：'+IP)
        );
        return false;
    }
    let cardIdisArr = cardId instanceof Array;
    let cardCountisArr = cardCount instanceof Array;
    // 传参必须是数组
    if(!cardIdisArr||!cardCountisArr){
        console.info(
            chalk.yellow(email+'传了非数组的分解数据，IP为：'+IP)
        )
        res.send({
            code:0,
            msg:'参数有误！'
        });
        return false;
    }
    if(cardId.length<=0){
        console.info(
            chalk.yellow(email+'传了空的分解数据，IP为：'+IP)
        )
        res.send({
            code:0,
            msg:'卡牌分解数量必须大于1张！'
        });
        return false;
    }else if(cardId.length>100){
        console.info(
            chalk.yellow(email+'传了过多的分解数据，IP为：'+IP)
        )
        res.send({
            code:0,
            msg:'一次只能分解100种卡牌！'
        });
        return false;
    }
    //去重
    cardId = utils.unique(cardId);
    // 去重后数量和卡牌对不上
    if(cardId.length!==cardCount.length){
        console.info(
            chalk.yellow(email+'去重后卡牌对不上分解数，IP为：'+IP)
        )
        res.send({
            code:0,
            msg:'参数有误！'
        });
        return false;
    }
    //开始分解
    let star  = 0;
    let cardNumCount = 0;
    let databaseCard = {};
    let getItem = {};
    let getItemDataBase = {};
    let ItemList = {
        "1":"101",
        "2":"102",
        "3":"103",
        "4":"104",
        "5":"105",
        "6":"106"
    };
    let params = {
        cardId:{$in:cardId}
    }
    let myCardData = await cardData.findCardDataMany(params).catch ((err)=>{
        res.send({
            code:0,
            msg:'内部错误请联系管理员！'
        });
        console.error(
            chalk.red('数据库查询错误！')
        );
        throw err;
    });
    if(myCardData.length!==cardId.length){
        console.info(
            chalk.yellow(email+'分解卡牌对不上数据库的数量，IP为：'+IP)
        )
        res.send({
            code:0,
            msg:'参数有误！'
        });
        return false;
    }
    let myCardDataObj = {};
    for(let i=0;i<myCardData.length;i++){
        myCardDataObj[myCardData[i].cardId] = myCardData[i];
    }
    for(let i=0;i<cardId.length;i++){
        let num = Math.floor(Number(cardCount[i]));
        num = Math.abs(num);
        // 如果是非数字
        if(isNaN(num)){
            console.info(
                chalk.yellow(email+'传了非数字的分解数据，IP为：'+IP)
            )
            res.send({
                code:0,
                msg:'参数有误！'
            });
            return false;
        }
        if(myCard[cardId[i]]-1<num){
            console.info(
                chalk.yellow(email+'试图分解并没有那么多或不存在的卡牌，IP为：'+IP)
            )
            res.send({
                code:0,
                msg:'您并没有这么多卡，请刷新页面！'
            });
            return false;
        }
        let dataStar = 0;
        try{
            dataStar = myCardDataObj[cardId[i]].star;
        }catch(err){
            console.info(
                chalk.yellow(email+'数据库不存在该卡牌，IP为：'+IP)
            )
            res.send({
                code:0,
                msg:'参数有误！'
            });
            return false;
        }
        let itemId = ItemList[dataStar];
        getItem[itemId] = (getItem[itemId]||0) + num;
        getItemDataBase['item.'+itemId] = (getItemDataBase['item.'+itemId]||0) + num;
        star = star + dataStar*num;
        cardNumCount = cardNumCount + num;
        databaseCard['card.'+packageId+'.'+cardId[i]] = -num;
    }
    databaseCard['star'] = star;
    let filters = {
        email: email
    }
    let updataParams = {
        $inc:databaseCard,
        ip:IP
    }
    await userData.updataUser(filters,updataParams).catch ((err)=>{
        res.send({
            code:0,
            msg:'内部错误请联系管理员！'
        });
        console.error(
            chalk.red('数据库更新错误！')
        );
        throw err;
    })
    // 写入道具
    let update_ = {
        $inc:getItemDataBase
    }
    await itemDatabase.findOneAndUpdate(filters,update_).catch ((err)=>{
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
        md5:result.md5,
        nickName:result.nickName,
        type:'dec',
        time:timeNow,
        data:{
            star:star,
            cardNumCount:cardNumCount,
            cardLength:cardId.length
        },
        ip:IP
    }
    utils.writeLog(logObject);
    console.info(
        chalk.green(email+'分解成功，一共获得了'+star+'颗星星，IP为：'+IP)
    )
    res.send({
        code:1,
        star:star,
        getItem:getItem,
        msg:'ok'
    });
}