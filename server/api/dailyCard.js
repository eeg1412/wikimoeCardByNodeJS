var usersModel = require('../models/users');
var utils = require('../utils/utils');
var md5 = require('md5-node');
var fs = require('fs');
var config = require('config-lite')(__dirname);
module.exports = function(req, res, next){
    console.log(req.body.email+'开始日常抽卡。');
    if(req.body.email){
        var userEmail = req.body.email.toLowerCase();
        var sel = Math.floor(req.body.sel);
        //判断选择的卡牌编号是否有误
        if(isNaN(sel)||sel<0||sel>2){
            res.send({
                code:0,
                msg:'参数有误！'
            });
            return false;
        }
        //验证邮箱格式
        if(utils.emailCheck(userEmail)){
            // document查询
            usersModel.findOne({ email: userEmail }, function(err, result) {
                if (err) {
                    res.send({
                        code:0,
                        msg:'内部错误请联系管理员！'
                    });
                    throw err;
                }else{
                    //判断是否有该用户
                    if(result){
                        let IP = utils.getUserIp(req);
                        let dailyCard = result.dailyCard;
                        let dailyCardTime = result.dailyCardTime*1000;
                        let timeNow = Math.round(new Date().getTime()/1000);
                        if(new Date(timeNow*1000).toDateString()===new Date(dailyCardTime).toDateString()){//如果是同天
                            if(dailyCard>=config.dailyChance){
                                res.send({
                                    code:3,
                                    msg:'已经超过今天的抽卡次数了！'
                                });
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
                        //判断是否有卡牌信息
                        if(result.card){
                            cardDataBase = result.card;
                            //判断是否已经拥有该卡
                            if(cardDataBase[cardId]){
                                cardDataBase[cardId] = cardDataBase[cardId]+1;
                            }else{
                                cardDataBase[cardId] = 1;
                            }
                        }else{
                            cardDataBase[cardId] = 1;
                        }
                        let emailmd5 = result.md5;
                        dailyCard = dailyCard +1;
                        usersModel.updateOne({email: userEmail}, {dailyCard:dailyCard,card: cardDataBase,ip:IP,dailyCardTime:timeNow}, function(err, docs){
                            if(err) {
                                throw err;
                            }else{
                                console.log('邮箱：'+userEmail+'，抽到卡牌：'+cardId);
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
                                    leftGetChance:config.dailyChance-dailyCard,
                                    msg:'ok'
                                });
                            }
                        })
                    }else{
                        res.send({
                            code:2,
                            msg:'该邮箱未注册！'
                        });
                    }
                }
            });
        }else{
            res.send({
                code:0,
                msg:'邮箱地址格式有误！'
            });
        }
    }else{
        res.send({
            code:0,
            msg:'邮箱地址不能为空！'
        });
    }
}