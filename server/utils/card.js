var logModel = require('../models/log');
var chalk = require('chalk');
var utils = require('./utils');
var fs = require('fs');
var userData = require('./database/user');
var cardPackageData = require('./database/cardPackage');
var cardData = require('./database/cardData');

// 判断卡包是否存在或者打开
exports.checkPackage = async function(packageId,packageOpen){
    let resaultPackage = await cardPackageData.findCardPackageOne({packageId:packageId}).catch((err)=>{
        console.error(
            chalk.red(err)
        );
        return false;
    });
    if(!resaultPackage){
        console.info(
            chalk.yellow('没有开放的卡包')
        )
        return false;
    }
    if(!resaultPackage[packageOpen]){
        console.info(
            chalk.yellow('此为未开放卡包返回false')
        )
        return false;
    }
    return resaultPackage;
}

//卡牌星级
exports.wmCreatCardId = function($randomCardRate,cardDataArr){
    if($randomCardRate>=1&&$randomCardRate<=64){
        //N
        let starCard = cardDataArr.filter(function(cardDataArr){
            return cardDataArr.star<=3;
        })
        let randomNum = utils.randomNum(0,starCard.length-1);
        return starCard[randomNum];
    }else if($randomCardRate>=65&&$randomCardRate<=86){
        //R
        let starCard = cardDataArr.filter(function(cardDataArr){
            return cardDataArr.star===4;
        })
        let randomNum = utils.randomNum(0,starCard.length-1);
        return starCard[randomNum];
    }else if($randomCardRate>=87&&$randomCardRate<=97){
        //SR
        let starCard = cardDataArr.filter(function(cardDataArr){
            return cardDataArr.star===5;
        })
        let randomNum = utils.randomNum(0,starCard.length-1);
        return starCard[randomNum];
    }else if($randomCardRate>97){
        //SSR
        let starCard = cardDataArr.filter(function(cardDataArr){
            return cardDataArr.star===6;
        })
        let randomNum = utils.randomNum(0,starCard.length-1);
        return starCard[randomNum];
    }
    return null;
}

// 抽卡
exports.chioseCard = async function(packageId,times =0,baodi,packageOpen = 'open'){
    // 检查卡包
    let package = await this.checkPackage(packageId,packageOpen);
    if(!package){
        return false;
    }
    // 拉取卡包下的卡牌信息
    let cardDataArr = await cardData.findCardDataMany({packageId:packageId}).catch((err)=>{
        console.error(
            chalk.red(err)
        );
        return false;
    });
    let cardIdArr = [];
    let starSix = 0;//统计有多少张六星
    for(let i=0;i<times;i++){
        let rareNum = utils.randomNum(1,100);
        if(rareNum>97){
            starSix++;
        }
        if(i===49&&starSix===0&&baodi){
            starSix++;
            rareNum = 98;
            console.info(
                chalk.green('50抽没抽到六星保底1张')
            )
        }else if(i===99&&starSix<=1&&baodi){
            starSix++;
            rareNum = 98;
            console.info(
                chalk.green('100抽没抽到六星保底2张')
            )
        }
        let addCard = this.wmCreatCardId(rareNum,cardDataArr);
        if(!addCard){
            return false;
        }
        cardIdArr.push(addCard);
    }
    return cardIdArr;
}