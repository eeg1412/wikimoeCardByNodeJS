var utils = require('../utils/utils');
var userbattleinfoData = require('../utils/database/userbattleinfo');
var itemData = require('../utils/database/item.js');
// var cardData = require('../data/cardData');
var chalk = require('chalk');
var userData = require('../utils/database/user');
var cardData = require('../utils/database/cardData');

function setChenggolv (v, l) {
    let lv = v;
    let n = 100;
    let down = 5;
    if (lv < 5) {
        return n;
    }
    if (l === 3) {
        down = 2;
    } else if (l === 1) {
        down = 4;
    }
    n = 100 - (lv + 1 - 5) * down;
    if (n < 1) {
        n = 1;
    }
    return n;
}
function setItemShould (leftType, level = 0) {
    let addCoe = 0;
    if (level > 19) { //假如等级大于20则需要的矿石数量会增加
        addCoe = level - 19;
    }
    let itemCount = 0;
    if (leftType == 1) {
        const itemCountBase = 45;
        itemCount = itemCountBase + (itemCountBase / 5 * addCoe);
    } else if (leftType == 2) {
        const itemCountBase = 60;
        itemCount = itemCountBase + (itemCountBase / 5 * addCoe);
    } else if (leftType == 3) {
        const itemCountBase = 30;
        itemCount = itemCountBase + (itemCountBase / 5 * addCoe);
    } else if (leftType == 4) {
        const itemCountBase = 60;
        itemCount = itemCountBase + (itemCountBase / 5 * addCoe);
    } else if (leftType == 5) {
        const itemCountBase = 345;
        itemCount = itemCountBase + (itemCountBase / 5 * addCoe);
    }
    return Math.round(itemCount);
}
function setCardShould (v, l = 0) {
    let shouldCard = 0;
    let shouldCoe = 0;
    let shouldCardBase = 0;
    if (l > 19) {
        shouldCoe = l - 19;
    }
    switch (v) {
        case 1:
            shouldCardBase = 3;
            shouldCard = shouldCardBase + ((shouldCardBase) * shouldCoe);
            break;
        case 2:
            shouldCardBase = 3;
            shouldCard = shouldCardBase + ((shouldCardBase) * shouldCoe);
            break;
        case 3:
            shouldCardBase = 15;
            shouldCard = shouldCardBase + ((shouldCardBase) * shouldCoe);
            break;
        case 4:
            shouldCardBase = 5;
            shouldCard = shouldCardBase + ((shouldCardBase) * shouldCoe);
            break;
        case 5:
            shouldCardBase = 3;
            shouldCard = shouldCardBase + ((shouldCardBase) * shouldCoe);
            break;
        case 6:
            shouldCardBase = 1;
            shouldCard = shouldCardBase + ((shouldCardBase) * shouldCoe);
            break;
    }
    return Math.round(shouldCard);
}

module.exports = async function (req, res, next) {
    let IP = utils.getUserIp(req);
    let token = req.body.token;
    let cardId = req.body.cardId;
    let usePieces = req.body.usePieces;
    console.info(
        chalk.green('开始查询卡牌等级,IP为：' + IP)
    )
    //解析token
    if (!token) {
        console.info(
            chalk.yellow(IP + '参数有误！')
        )
        res.send({
            code: 403,
            msg: 'token为空！'
        });
        return false;
    }
    let result = await utils.tokenCheckAndEmail(token).catch((err) => {
        throw err;
    });
    if (!result) {
        res.send({
            code: 403,
            msg: '账户信息已失效，请重新登录！'
        });
        console.info(
            chalk.yellow('查询结果无该用户,IP为：' + IP)
        );
        return false;
    }
    let email = result.email;
    console.info(
        chalk.green(IP + '的邮箱解析结果为' + email)
    )
    //检查卡牌是否存在
    // let myCardData = cardData['cardData'][utils.PrefixInteger(cardId,4)];
    // if(!myCardData){
    //     res.send({
    //         code:0,
    //         msg:'您没有这张卡！'
    //     });
    //     console.info(
    //         chalk.yellow(email+'查询了不存在的卡,IP为：'+IP)
    //     );
    //     return false;
    // }
    //检查用户是否有卡
    if (!result.card) {
        res.send({
            code: 0,
            msg: '您还没有卡牌！'
        });
        console.info(
            chalk.yellow(email + '想升级但是没有卡牌,IP为：' + IP)
        );
        return false;
    }
    let myCardData = await cardData.findCardDataOne({ cardId: cardId }).catch((err) => {
        res.send({
            code: 0,
            msg: '内部错误请联系管理员！'
        });
        console.error(
            chalk.red('数据库查询错误！')
        );
        throw err;
    });
    if (!myCardData) {
        res.send({
            code: 0,
            msg: '您没有这张卡！'
        });
        console.info(
            chalk.yellow(email + '查询了不存在的卡,IP为：' + IP)
        );
        return false;
    }
    let params = {
        email: email
    }
    //查询卡牌等级
    let cardLevelData = await userbattleinfoData.findOne(params).catch((err) => {
        res.send({
            code: 0,
            msg: '内部错误请联系管理员！'
        });
        console.error(
            chalk.red('数据库错误！')
        );
        throw err;
    }) || {};
    let cardLevel = cardLevelData['cardLevel'] || {};//获取卡牌等级
    let myCardLevel = cardLevel[cardId] || 0;
    //检查卡牌是否拥有
    let shouldCardNum = setCardShould(myCardData.star, myCardLevel);
    let myCardCount = result.card[myCardData.packageId][cardId] || 0;
    if (myCardCount <= 0) {
        res.send({
            code: 0,
            msg: '您没有这张卡！'
        });
        console.info(
            chalk.yellow(email + '查询了自己没拥有的卡,IP为：' + IP)
        );
        return false;
    }
    //是否有足够数量的卡
    if ((myCardCount <= shouldCardNum) && !usePieces) {
        res.send({
            code: 0,
            msg: '您的卡牌不足,快去抽卡吧！'
        });
        console.info(
            chalk.yellow(email + '想升级卡牌，但是卡牌数量不足,IP为：' + IP)
        );
        return false;
    }
    //查询道具信息
    let itemData_ = await itemData.findOne(params).catch((err) => {
        res.send({
            code: 0,
            msg: '内部错误请联系管理员！'
        });
        console.error(
            chalk.red('数据库错误！')
        );
        throw err;
    }) || {};
    let userItemData = itemData_['item'] || {};//获取道具信息
    let shouldItemId = myCardData.cry + '' + myCardData.leftType;//需要道具信息
    let myItemNum = userItemData[shouldItemId] || 0;
    let shouldItemNum = setItemShould(myCardData.leftType, myCardLevel);
    if (myItemNum < shouldItemNum) {
        res.send({
            code: 0,
            msg: '您的升级材料储量不足,快去挖矿吧！'
        });
        console.info(
            chalk.yellow(email + '想升级卡牌，但是升级道具不足,IP为：' + IP)
        );
        return false;
    }
    // 卡牌所需碎片ID
    const ItemList = {
        "1": "101",
        "2": "102",
        "3": "103",
        "4": "104",
        "5": "105",
        "6": "106"
    };
    //删卡数据库
    let cardDataBase = {};
    cardDataBase['card.' + myCardData.packageId + '.' + cardId] = -shouldCardNum;
    let shouldPieces = 0;//需要多少碎片
    let pieceId = ItemList[myCardData.star];//碎片ID
    let myPieces = userItemData[pieceId] || 0;//碎片数量
    let itemDataBase = {};//删除的道具
    if (usePieces) {
        let cardCha = shouldCardNum - myCardCount + 1;//还差多少张卡
        if (cardCha > 0) {
            shouldPieces = cardCha * 3;
            if (myPieces < shouldPieces) {//如果碎片不够
                res.send({
                    code: 0,
                    msg: '您的卡牌碎片不足,可以从分解卡牌中获得！'
                });
                console.info(
                    chalk.yellow(email + '想升级卡牌，但是碎片不足,IP为：' + IP)
                );
                return false;
            }
            itemDataBase['item.' + pieceId] = -shouldPieces;
            cardDataBase['card.' + myCardData.packageId + '.' + cardId] = -(shouldCardNum - cardCha);
        }

    }
    //安全起见再对比下卡牌是否超过了拥有的卡牌数量
    if (myCardCount <= Math.abs(cardDataBase['card.' + myCardData.packageId + '.' + cardId])) {
        res.send({
            code: 0,
            msg: '您的升级卡牌不足,快去挖矿吧！'
        });
        console.info(
            chalk.yellow(email + '想升级卡牌，但是升级卡牌不足,IP为：' + IP)
        );
        return false;
    }
    // 20200628取消卡牌升级概率
    let chenggongyinzi = 100;//utils.randomNum(1, 100)//成功率因子
    let chenggonglv = 100;//setChenggolv(myCardLevel, myCardData.leftType);//计算成功率
    //删道具数据库操作
    itemDataBase['item.' + shouldItemId] = -shouldItemNum;
    let updataItemParams = {
        $inc: itemDataBase,
    }
    await itemData.findOneAndUpdate(params, updataItemParams).catch((err) => {
        res.send({
            code: 0,
            msg: '内部错误请联系管理员！'
        });
        console.error(
            chalk.red('数据库错误！')
        );
        throw err;
    })
    //是否成功
    console.info(
        chalk.green(email + '的升级成功率为' + chenggonglv + '%')
    )
    let isSuccess = chenggongyinzi <= chenggonglv;
    let getStar = 0;
    if (isSuccess) {
        //升级
        let cardLvDataBase = {};
        cardLvDataBase['cardLevel.' + cardId] = 1;
        let update = {
            $inc: cardLvDataBase
        };
        await userbattleinfoData.findOneAndUpdate(params, update).catch((err) => {
            res.send({
                code: 0,
                msg: '内部错误请联系管理员！'
            });
            console.error(
                chalk.red('数据库错误！')
            );
            throw err;
        });
        myCardLevel = myCardLevel + 1;
        console.info(
            chalk.green(email + '升级成功，卡牌' + cardId + '升级为' + (myCardLevel) + '级')
        )
    } else {
        //如果失败
        getStar = myCardData.star * Math.abs(cardDataBase['card.' + myCardData.packageId + '.' + cardId]);
        console.info(
            chalk.green(email + '升级失败，卡牌' + cardId + '化作了' + getStar + '颗星星')
        )
    }
    //操作删卡
    if (getStar > 0) {
        cardDataBase['star'] = getStar;
    }
    let updataParams = {
        $inc: cardDataBase,
        ip: IP
    }
    await userData.updataUser(params, updataParams).catch((err) => {
        res.send({
            code: 0,
            msg: '内部错误请联系管理员！'
        });
        console.error(
            chalk.red('数据库更新错误！')
        );
        throw err;
    });
    let timeNow = Math.round(new Date().getTime() / 1000);
    let logObject = {
        email: email,
        md5: result.md5,
        nickName: result.nickName,
        type: 'upgradecard',
        time: timeNow,
        data: {
            isSuccess: isSuccess,
            getStar: getStar,
            myCardLevel: myCardLevel,
            cardName: myCardData.name,
            cardId: cardId,
            packageId: myCardData.packageId
        },
        ip: IP
    }
    utils.writeLog(logObject);
    res.send({
        code: 1,
        isSuccess: isSuccess,
        getStar: getStar,
        myCardLevel: myCardLevel,
        cardNum: myCardCount + cardDataBase['card.' + myCardData.packageId + '.' + cardId],
        itemNum: myItemNum - shouldItemNum,
        myPieces: myPieces + (itemDataBase['item.' + pieceId] || 0),
        pieceId: pieceId,
        itemId: shouldItemId,
        msg: 'ok'
    });
}