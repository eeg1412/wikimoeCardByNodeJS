var utils = require('../utils/utils');
var userData = require('../utils/database/user');
var md5 = require('md5-node');
var fs = require('fs');
var chalk = require('chalk');
module.exports = async function(req, res, next){
    let IP = utils.getUserIp(req);
    console.info(
        chalk.green(req.body.email+'开始日常抽卡。IP为：'+IP)
    );
    if(req.body.email){
        var userEmail = req.body.email.toLowerCase();
        var sel = Math.floor(req.body.sel);
        //判断选择的卡牌编号是否有误
        if(isNaN(sel)||sel<0||sel>2){
            res.send({
                code:0,
                msg:'参数有误！'
            });
            console.info(
                chalk.yellow(req.body.email+'传参(sel)有误！IP为：'+IP)
            );
            return false;
        }
        //验证邮箱格式
        if(utils.emailCheck(userEmail)){
            let params = { email: userEmail }
            // document查询
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
            //判断是否有该用户
            if(result){
                if(result.ban >0){
                    res.send({
                        code:0,
                        msg:'该账户已被封禁！'
                    });
                    console.info(
                        chalk.yellow(req.body.email+'已被封禁！IP为：'+IP)
                    );
                    return false;
                }
                let dailyCard = result.dailyCard;
                let dailyCardTime = Math.round(Number(result.dailyCardTime)*1000);
                let timeNow = Math.round(new Date().getTime()/1000);
                if(new Date(timeNow*1000).toDateString()===new Date(dailyCardTime).toDateString()){//如果是同天
                    if(dailyCard>=global.myAppConfig.dailyChance){
                        res.send({
                            code:3,
                            msg:'已经超过今天的抽卡次数了！'
                        });
                        console.info(
                            chalk.blue(req.body.email+'超过每日抽卡限制。IP为：'+IP)
                        );
                        return false;
                    }
                }else{
                    dailyCard = 0;
                }
                //循环三张牌
                let cardIdArr = [];
                while (cardIdArr.length<3){
                    let rareNum = utils.randomNum(1,100);
                    cardIdArr.push(utils.wmCreatCardId(rareNum));
                    cardIdArr = utils.unique(cardIdArr);
                }

                let cardId = cardIdArr[sel];
                if(cardId===undefined||cardId===null){
                    res.send({
                        code:0,
                        msg:'数据错误！'
                    });
                    return false;
                }
                let cardDataBase = {};
                cardDataBase['card.'+cardId] = 1;
                let emailmd5 = result.md5;
                dailyCard = dailyCard +1;
                let filters = {
                    email: userEmail
                }
                let updataParams = {
                    dailyCard:dailyCard,
                    $inc:cardDataBase,
                    ip:IP,
                    dailyCardTime:timeNow
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
                console.info(
                    chalk.green('邮箱：'+userEmail+'，抽到卡牌：【'+cardId+'】! IP为：'+IP)
                );
                let cardData = fs.readFileSync('./data/cardData.json', 'utf8');
                cardData = JSON.parse(cardData)['cardData'];
                let cardID_ = utils.PrefixInteger(cardId,4);
                let logObject = {
                    email:userEmail,
                    md5:md5(userEmail),
                    nickName:result.nickName,
                    type:'dailyCard',
                    time:timeNow,
                    data:{
                        cardId:cardID_,
                        title:cardData[cardID_].title,
                        name:cardData[cardID_].name,
                        star:cardData[cardID_].star
                    },
                    ip:IP
                }
                utils.writeLog(logObject);
                res.send({
                    code:1,
                    cardChoiseList:cardIdArr,
                    choiseIndex:sel,
                    emailmd5:emailmd5,
                    card:cardId,
                    leftGetChance:global.myAppConfig.dailyChance-dailyCard,
                    msg:'ok'
                });
            }else{
                res.send({
                    code:2,
                    msg:'该邮箱未注册！'
                });
                console.info(
                    chalk.blue(req.body.email+'并未注册。IP为：'+IP)
                );
            }
        }else{
            res.send({
                code:0,
                msg:'邮箱地址格式有误！'
            });
            console.info(
                chalk.yellow('邮箱格式有误，IP为：'+IP)
            );
        }
    }else{
        res.send({
            code:0,
            msg:'邮箱地址不能为空！'
        });
        console.info(
            chalk.yellow('邮箱为空，IP为：'+IP)
        );
    }
}