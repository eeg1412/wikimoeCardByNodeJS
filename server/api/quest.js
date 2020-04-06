const chalk = require('chalk');
const utils = require('../utils/utils');
const cardData = require('../utils/database/cardData');
const cardPackageData = require('../utils/database/cardPackage');
const userData = require('../utils/database/user');
const questData = require('../utils/database/quest');
const itemInfo = require('../data/item.json');
const itemDatabase = require('../utils/database/item');

class quest {
    constructor(IP, token, userInfo, email, req, res, next) {
        this.IP = IP;
        this.token = token;
        this.userInfo = userInfo;
        this.email = email;
        this.req = req;
        this.res = res;
        this.next = next;
        this.userQuest = [];
        this.cardInfo = null;
    }
    sendSuccess(info,msg){
        this.send({
            code:1,
            msg:msg,
            ...info
        });
        console.info(
            chalk.green(msg+',IP:' + this.IP + ',邮箱：' + this.email)
        );
    }
    sendError(msg){
        this.send({
            code:0,
            msg:msg
        });
        console.info(
            chalk.yellow(msg+',IP:' + this.IP + ',邮箱：' + this.email)
        );
    }
    send(info){
        this.res.send(info);
    }
    async getUserCardCount(update){
        if(update){
            this.userInfo = await userData.findUser({email:this.email}).catch ((err)=>{
                console.error(
                    chalk.red('数据库查询错误！')
                );
                throw err;
            })
        };
        // 获取任务列表中的所有卡牌数据
        let questUserCardData = {};
        for(let i=0;i<this.userQuest.length;i++){
            const thisQuestClass = this.userQuest[i].class;
            if(thisQuestClass==="cardToBattle" || thisQuestClass==="cardToItem"){
                const thisShould = this.userQuest[i].should;
                for(let j=0;j<thisShould.length;j++){
                    const cardId = thisShould[j].card.cardId;
                    const packageId = thisShould[j].card.packageId;
                    questUserCardData[cardId] = 0;
                    try{
                        questUserCardData[cardId] = this.userInfo.card[packageId][cardId] || 0;
                    }
                    catch(err){
                        
                    }
                    // questCard.push(thisShould[j].cardId);
                }

            }
        }
        return questUserCardData;
        
    }
    async getCardData(){
        // 获取卡牌数据
        // 查询开放的卡包
        const resaultPackage = await cardPackageData.findCardPackageMany({
            $or:[{starShopOpen:true},{open:true}]
        }).catch((err)=>{
            console.error(
                chalk.red(err)
            );
            return false;
        });
        if(resaultPackage.length<=0){
            this.sendError('任务模块未设置商店和日常猜卡卡包！');
            throw '任务模块，未设置商店和日常猜卡卡包！';
        }
        let openPackageId = [];
        for(let i=0;i<resaultPackage.length;i++){
            openPackageId.push(resaultPackage[i].packageId)
        }
        // 将所有卡牌数据读入
        const allCardData = await cardData.findCardDataMany({packageId:{$in:openPackageId}},'-auther -md5 -__v').catch((err)=>{
            console.error(
                chalk.red(err)
            );
            this.sendError('任务模块卡牌数据读入错误！');
            throw '任务模块，卡牌数据读入错误！';
        });
        // 卡牌星级分类
        let cardFindData = [];
        const starSix = allCardData.filter(item => item.star===6);
        const starFive = allCardData.filter(item => item.star===5);
        const starFour = allCardData.filter(item => item.star===4);
        const starThree = allCardData.filter(item => item.star===3);
        const starTwo = allCardData.filter(item => item.star===2);
        const starOne = allCardData.filter(item => item.star===1);
        cardFindData.push(starOne);
        cardFindData.push(starTwo);
        cardFindData.push(starThree);
        cardFindData.push(starFour);
        cardFindData.push(starFive);
        cardFindData.push(starSix);
        return cardFindData;
    }
    async newQuest(count){
        // 生成新任务
        const questList = [
            {
                class:"dataDemin",
                title:"挖出30颗星星吧！",
                text:"在矿场累计挖到30颗星星",
                should:[
                    {number:30}
                ],
                gift:[
                    {
                        type:"star",
                        number:10
                    }
                ],
                mark:0,
                lock:false,
                expired:0

            },
            {
                class:"dataDemin",
                title:"挖出60颗星星吧！",
                text:"在矿场累计挖到60颗星星",
                should:[
                    {number:60}
                ],
                gift:[
                    {
                        type:"item",
                        itemId:400,
                        number:1
                    },
                    {
                        type:"star",
                        number:10
                    }
                ],
                mark:0,
                lock:false,
                expired:0
            },
            {
                class:"dataDemin",
                title:"挖出100颗星星吧！",
                text:"在矿场累计挖到100颗星星",
                should:[
                    {number:100}
                ],
                gift:[
                    {
                        type:"item",
                        itemId:400,
                        number:1
                    },
                    {
                        type:"star",
                        number:10
                    }
                ],
                mark:0,
                lock:false,
                expired:0
            },
            {
                class:"dataGuessCard",
                title:"猜中3张卡牌吧！",
                text:"在猜卡中累计猜中3张卡牌",
                should:[
                    {number:3}
                ],
                gift:[
                    {
                        type:"star",
                        number:10
                    }
                ],
                mark:0,
                lock:false,
                expired:0
            },
            {
                class:"dataGuessCard",
                title:"猜中6张卡牌吧！",
                text:"在猜卡中累计猜中6张卡牌",
                should:[
                    {number:6}
                ],
                gift:[
                    {
                        type:"star",
                        number:20
                    }
                ],
                mark:0,
                lock:false,
                expired:0
            },
            {
                class:"dataGuessCard",
                title:"猜中10张卡牌吧！",
                text:"在猜卡中累计猜中10张卡牌",
                should:[
                    {number:10}
                ],
                gift:[
                    {
                        type:"item",
                        itemId:402,
                        number:1
                    },
                    {
                        type:"star",
                        number:30
                    }
                ],
                mark:0,
                lock:false,
                expired:0
            },
            {
                class:"cardToItem",
                title:"交换星星镐！",
                text:"使用多余的卡牌交换星星镐！",
                should:[
                    {
                        star:3,
                        number:1
                    }
                ],
                gift:[
                    {
                        type:"item",
                        itemId:400,
                        number:1
                    }
                ],
                mark:0,
                lock:false,
                expired:0
            },
            {
                class:"cardToItem",
                title:"交换宝石镐！",
                text:"使用多余的卡牌交换宝石镐！",
                should:[
                    {
                        star:3,
                        number:1
                    },
                    {
                        star:3,
                        number:1
                    },
                    {
                        star:3,
                        number:1
                    },
                    {
                        star:4,
                        number:1
                    }
                ],
                gift:[
                    {
                        type:"item",
                        itemId:401,
                        number:1
                    }
                ],
                mark:0,
                lock:false,
                expired:0
            },
            {
                class:"cardToItem",
                title:"交换保罗炸弹！",
                text:"使用多余的卡牌交换保罗炸弹！",
                should:[
                    {
                        star:3,
                        number:1
                    },
                    {
                        star:4,
                        number:1
                    },
                    {
                        star:4,
                        number:1
                    },
                    {
                        star:5,
                        number:1
                    }
                ],
                gift:[
                    {
                        type:"item",
                        itemId:402,
                        number:1
                    }
                ],
                mark:0,
                lock:false,
                expired:0
            },
            {
                class:"cardToItem",
                title:"交换补签羽毛笔！",
                text:"使用多余的卡牌交换补签羽毛笔！",
                should:[
                    {
                        star:5,
                        number:1
                    },
                    {
                        star:6,
                        number:1
                    }
                ],
                gift:[
                    {
                        type:"item",
                        itemId:201,
                        number:1
                    }
                ],
                mark:0,
                lock:false,
                expired:0
            },
            {
                class:"cardToItem",
                title:"交换等级转换卷轴！",
                text:"使用多余的卡牌交换等级转换卷轴！",
                should:[
                    {
                        star:1,
                        number:2
                    },
                    {
                        star:2,
                        number:2
                    },
                    {
                        star:3,
                        number:2
                    },
                    {
                        star:4,
                        number:2
                    },
                    {
                        star:5,
                        number:2
                    },
                    {
                        star:6,
                        number:2
                    }
                ],
                gift:[
                    {
                        type:"item",
                        itemId:200,
                        number:1
                    }
                ],
                mark:0,
                lock:false,
                expired:0
            },
            {
                class:"cardToItem",
                title:"交换结缘币！",
                text:"使用多余的卡牌交换结缘币！",
                should:[
                    {
                        star:1,
                        number:1
                    },
                    {
                        star:2,
                        number:1
                    },
                    {
                        star:3,
                        number:1
                    },
                    {
                        star:4,
                        number:1
                    },
                    {
                        star:5,
                        number:1
                    },
                    {
                        star:6,
                        number:1
                    }
                ],
                gift:[
                    {
                        type:"item",
                        itemId:300,
                        number:1
                    }
                ],
                mark:0,
                lock:false,
                expired:0
            },
            {
                class:"cardToBattle",
                title:"获取更多的对战机会吧！",
                text:"用多余的卡牌交换对战机会！",
                should:[
                    {
                        star:5,
                        number:1
                    }
                ],
                gift:[
                    {
                        type:"battle",
                        number:1
                    }
                ],
                mark:0,
                lock:false,
                expired:0
            }
        ]
        // 新任务列表
        let newQuestList = [];
        // 循环随机生成任务
        for(let i=0;i<count;i++){
            let thisQuest = {...questList[utils.randomNum(0,questList.length-1)]};
            thisQuest['email'] = this.email;
            let thisQuestClass = thisQuest.class;
            let countFlag = true;
            let timeAfter = Math.round(new Date().getTime()/1000)+86400;
            // 如果是统计类任务，判断不能重复
            if(thisQuestClass==="dataDemin" || thisQuestClass==="dataGuessCard"){
                // 判断数据库任务是否有该类任务
                const dataClass = this.userQuest.filter(item=>item.class===thisQuestClass);
                if(dataClass.length>0){
                    i--;
                    countFlag = false;
                }else{
                    // 判断新任务列表是否有该类任务
                    const newDataClass = newQuestList.filter(item=>item.class===thisQuestClass);
                    if(newDataClass.length>0){
                        i--;
                        countFlag = false;
                    }
                }
                if(countFlag){
                    thisQuest['expired'] = timeAfter;
                    if(thisQuestClass==="dataDemin"){
                        thisQuest['mark'] = '0';//Number(this.userInfo.deminingStarCount);
                    }else{
                        thisQuest['mark'] = '0';//Number(this.userInfo.guessCardCount);
                    }
                    // 导入新数据
                    newQuestList.push(thisQuest);
                }
            }else{
                // 卡牌交换类
                if(this.cardInfo===null){
                    this.cardInfo = await this.getCardData();
                    if(!this.cardInfo){
                        this.sendError('任务模块获取卡牌数据错误！');
                        throw '任务模块获取卡牌数据错误！';
                    }
                }
                // 获取所需卡牌数组
                const shouldCard = thisQuest.should;
                let newShould = [];
                // 循环需要获取的卡牌
                for(let j=0;j<shouldCard.length;j++){
                    const s = shouldCard[j].star;//星级
                    const n = shouldCard[j].number;//数量
                    // this.sendSuccess({test:this.cardInfo},'');
                    // break;
                    let thisCard = utils.randomArray(this.cardInfo[s-1],1)[0];
                    // 比对有没有重复
                    const thiscardId = thisCard._id;
                    const cardIdCheck = newShould.filter(item=>item.card===thiscardId);
                    if(cardIdCheck.length>0){
                        j--;
                    }else{
                        let thisCardId = {
                            card:thiscardId,
                            number:n
                        }
                        newShould.push(thisCardId);
                    }
                }
                thisQuest['should'] = newShould;
                thisQuest['expired'] = timeAfter;
                newQuestList.push(thisQuest);
            }
        }
        //this.sendSuccess({test:newQuestList},'');
        return newQuestList;
    }
    async searchQuest(){
        // 删除过期的任务
        let timeNow = Math.round(new Date().getTime()/1000);
        let delParmas = {
            lock:false,
            email:this.email,
            expired:{$lt:timeNow},
        }
        await questData.deleQuestMany(delParmas).catch ((err)=>{
            throw err;
        });
        // 查询任务
        this.userQuest = await questData.findQuestMany({
            email:this.email,
            $or:[
                {expired:{$gte:timeNow}},
                {lock:true},
            ],
        },'-email -__v -card._id -card.__v -card.auther -card.md5').catch ((err)=>{
            throw err;
        });
        // 任务数量是否小于6?
        if(this.userQuest.length<6){
            const newQuestData = await this.newQuest(6-this.userQuest.length);
            // 存入数据库
            await questData.insertManyQuest(newQuestData).catch ((err)=>{
                throw err;
            });
            // 查询任务
            this.userQuest = await questData.findQuestMany({
                email:this.email,
                $or:[
                    {expired:{$gte:timeNow}},
                    {lock:true},
                ],
            },'-email -__v').catch ((err)=>{
                throw err;
            });
        }
        return this.userQuest;
    }
    async checkQuestById(_id){
        // 正则检查ID格式
        const email = this.email;
        const IP = this.IP;
        const timeNow = Math.round(new Date().getTime()/1000);
        if(!utils.objectIDCheck(_id)){
            console.info(
                chalk.yellow('email:'+email+'使用了不正确的数据库ID。ID为：'+_id+'IP为：'+IP)
            );
            return false;
        }
        // 查询任务
        const thisQuest = await questData.findQuestOne({
            email:email,
            _id:_id,
            $or:[
                {expired:{$gte:timeNow}},
                {lock:true},
            ],
        },'-email -__v').catch ((err)=>{
            throw err;
        });
        return thisQuest;
    }
    async acceptQuest(){
        const _id = this.req.body.id;
        const thisQuestData = await this.checkQuestById(_id);
        if(!thisQuestData){
            this.sendError('该任务不存在，可能已过期，请刷新！');
            return false;
        }
        if(thisQuestData.lock === true){
            this.sendError('该任务已接受，努力完成吧！');
            return false;
        }
        let thisQuestClass = thisQuestData.class;
        let params = {
            lock:true
        };
        if(thisQuestClass==="dataDemin"){
            params['mark'] = this.userInfo.deminingStarCount;
        }else if(thisQuestClass==="dataGuessCard"){
            params['mark'] = this.userInfo.guessCardCount;
        }
        await questData.updataQuest({_id:_id},params).catch ((err)=>{
            this.sendError('内部错误，更新失败！');
            console.error(
                chalk.red('数据库更新错误！')
            );
            throw err;
        });
        const userQuestData = await this.searchQuest();
        const userCard = await this.getUserCardCount(false);
        this.sendSuccess({
            list:userQuestData,
            card:userCard,
            dem:this.userInfo.deminingStarCount,
            gc:this.userInfo.guessCardCount,
            questCount:this.userInfo.questCount,
            questTreasure:this.userInfo.questTreasure,
            battleCard:this.userInfo.battleCard,
        },'任务接受成功！');
    }
    async changeQuest(){
        const _id = this.req.body.id;
        const thisQuestData = await this.checkQuestById(_id);
        const price = 150;
        if(!thisQuestData){
            this.sendError('该任务不存在，可能已过期，请刷新！');
            return false;
        }
        // 判断用户够不够星星
        if(this.userInfo.star<price){
            this.sendError('星星不足，不能更换任务！');
            return false;
        }
        // 扣星星
        const updataParams = {
            $inc:{
                star:-price
            },
            ip:this.IP
        }
        await userData.updataUser({email:this.email},updataParams,false).catch ((err)=>{
            this.sendError('内部错误，更新失败！');
            console.error(
                chalk.red('数据库更新错误！')
            );
            throw err;
        });
        // 删除任务
        let delParmas = {
            _id:_id
        }
        await questData.deleQuest(delParmas).catch ((err)=>{
            throw err;
        });
        const userQuestData = await this.searchQuest();
        const userCard = await this.getUserCardCount(false);
        this.sendSuccess({
            list:userQuestData,
            card:userCard,
            dem:this.userInfo.deminingStarCount,
            gc:this.userInfo.guessCardCount,
            questCount:this.userInfo.questCount,
            questTreasure:this.userInfo.questTreasure,
            battleCard:this.userInfo.battleCard,
        },'任务放弃成功！');
    }
    async complete(){
        // 完成任务
        const _id = this.req.body.id;
        const thisQuestData = await this.checkQuestById(_id);
        if(!thisQuestData){
            this.sendError('该任务不存在，可能已过期，请刷新！');
            return false;
        }
        if(thisQuestData.lock === false){
            this.sendError('请先接受任务！');
            return false;
        }
        const thisQuestClass = thisQuestData.class;
        let userWriteData = {
            $inc:{
                "questCount":1
            },
            ip:this.IP
        };
        let itemWriteData = {};
        let questCheckOK = false;
        switch (thisQuestClass) {
            case 'dataDemin': {
                // 挖矿统计
                const demData = Number(thisQuestData.mark);
                const demNow = Number(this.userInfo.deminingStarCount);
                const shouldNum = demData + Number(thisQuestData.should[0].number);
                if(demNow>=shouldNum){
                    questCheckOK = true;
                }
                break;
            }
            case 'dataGuessCard': {
                // 猜卡统计
                const GcData = Number(thisQuestData.mark);
                const GcNow = Number(this.userInfo.guessCardCount);
                const shouldNum = GcData + Number(thisQuestData.should[0].number);
                if(GcNow>=shouldNum){
                    questCheckOK = true;
                }
                break;
            }
            case 'cardToBattle': {
            }
            case 'cardToItem': {
                // 卡牌交换道具
                const shouldCard = thisQuestData.should;
                let noFlag = false;
                for(let i=0;i<shouldCard.length;i++){
                    // 循环所需卡牌
                    const cardId = shouldCard[i].card.cardId;
                    const packageId = shouldCard[i].card.packageId;
                    const shouldNum = shouldCard[i].number + 1;
                    let thisCardNum = 0;
                    try{
                        thisCardNum = this.userInfo.card[packageId][cardId] || 0;
                        userWriteData['$inc']['card.'+packageId+'.'+cardId] = -shouldCard[i].number;
                    }catch(err){
                        noFlag = true;
                        break;
                    }
                    if(thisCardNum<shouldNum){
                        noFlag = true;
                        break;
                    }
                }
                
                if(!noFlag){
                    questCheckOK = true;
                }
                break;
            }
        }
        if(!questCheckOK){
            this.sendError('该任务尚未完成！');
            return false;
        }
        // 完成任务
        // 获取奖励列表
        const gifts = thisQuestData.gift;
        let historyMsg = '';
        for(let i=0;i<gifts.length;i++){
            const giftType = gifts[i].type;
            switch (giftType) {
                case 'item': {
                    const itemId = gifts[i].itemId;
                    const itemNumber = gifts[i].number;
                    if(!itemWriteData["$inc"]){
                        itemWriteData["$inc"] = {};
                    }
                    historyMsg = historyMsg + '【' + itemInfo[itemId].name + '×' + itemNumber + '】、';
                    itemWriteData["$inc"]['item.'+itemId] = itemNumber;
                    break;
                }
                case 'star': {
                    const starNumber = gifts[i].number;
                    userWriteData['$inc']['star'] = starNumber;
                    historyMsg = historyMsg + '【星星' + '×' + starNumber + '】、';
                    break;
                }
                case 'battle': {
                    const dataChanceData = utils.battleChance(this.userInfo);
                    let myBattleTimes = dataChanceData.battleChance;//对战机会
                    const battleNumber = gifts[i].number;
                    if(myBattleTimes>=6){
                        userWriteData['battleDailyCount'] = myBattleTimes+battleNumber;
                    }else{
                        userWriteData['$inc']['battleDailyCount'] = battleNumber;
                    }
                    historyMsg = historyMsg + '【对战机会' + '+' + battleNumber + '】、';
                    break;
                }
            }
        }
        historyMsg = historyMsg.substr(0, historyMsg.length - 1);
        // 删除任务
        let delParmas = {
            _id:_id
        }
        await questData.deleQuest(delParmas).catch ((err)=>{
            throw err;
        });
        // 判断有没有道具写入
        const arrItem = Object.keys(itemWriteData);
        if(arrItem.length>0){
            await itemDatabase.findOneAndUpdate({email:this.email},itemWriteData).catch ((err)=>{
                console.error(
                    chalk.red('数据库更新错误！')
                );
                throw err;
            });
        }
        // 写入用户数据
        await userData.updataUser({email:this.email},userWriteData,false).catch ((err)=>{
            console.error(
                chalk.red('数据库更新错误！')
            );
            throw err;
        });
        const userQuestData = await this.searchQuest();
        const userCard = await this.getUserCardCount(true);
        this.sendSuccess({
            list:userQuestData,
            card:userCard,
            dem:this.userInfo.deminingStarCount,
            gc:this.userInfo.guessCardCount,
            questCount:this.userInfo.questCount,
            questTreasure:this.userInfo.questTreasure,
            battleCard:this.userInfo.battleCard,
        },`任务完成！获得了${historyMsg}。`);
        // 写入历史记录
        const timeNow = Math.round(new Date().getTime()/1000);
        const logObject = {
            email:this.email,
            md5:this.userInfo.md5,
            nickName:this.userInfo.nickName,
            type:'quest',
            time:timeNow,
            data:{
                msg:historyMsg,
                title:thisQuestData.title
            },
            ip:this.IP
        }
        utils.writeLog(logObject);

    }
    async treasure(){
        const questTreasure = Number(this.userInfo.questTreasure);
        const questCount = Number(this.userInfo.questCount);
        const shouldQuest = (questTreasure+1)*30 - questCount;
        if(shouldQuest>0){
            this.sendError('您并没有完成30次任务！');
            return false;
        }
        // 奖品列表
        const treasureList = [
            {
                type:"item",
                itemId:300,
                number:10
            },
            {
                type:"item",
                itemId:402,
                number:20
            },
            {
                type:"item",
                itemId:106,
                number:20
            },
            {
                type:"item",
                itemId:105,
                number:60
            }
        ];
        const thisTreasure = treasureList[utils.randomNum(0,treasureList.length-1)];
        let userWriteData = {
            $inc:{
                "questTreasure":1
            },
            ip:this.IP
        };
        let itemWriteData = {
            $inc:{},
        };
        let historyMsg = '';
        switch (thisTreasure.type) {
            case 'item': {
                const itemId = thisTreasure.itemId;
                const itemNumber = thisTreasure.number;
                itemWriteData["$inc"]['item.'+itemId] = itemNumber;
                historyMsg = `获得【${itemInfo[itemId].name}】×${itemNumber}`;
                break;
            }
        }
        await itemDatabase.findOneAndUpdate({email:this.email},itemWriteData).catch ((err)=>{
            console.error(
                chalk.red('数据库更新错误！')
            );
            throw err;
        });
        // 写入用户数据
        await userData.updataUser({email:this.email},userWriteData,false).catch ((err)=>{
            console.error(
                chalk.red('数据库更新错误！')
            );
            throw err;
        });
        this.sendSuccess({
            questCount:this.userInfo.questCount,
            questTreasure:Number(this.userInfo.questTreasure)+1,
        },`任务完成！获得了${historyMsg}。`);
        // 写入历史记录
        const timeNow = Math.round(new Date().getTime()/1000);
        const logObject = {
            email:this.email,
            md5:this.userInfo.md5,
            nickName:this.userInfo.nickName,
            type:'treasure',
            time:timeNow,
            data:{
                msg:historyMsg
            },
            ip:this.IP
        }
        utils.writeLog(logObject);
    }
}
module.exports = async function(req, res, next){
    const IP = utils.getUserIp(req);
    const token = req.body.token;
    const type = req.body.type;
    console.info(
        chalk.green('开始查询猜卡,IP为：'+IP)
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
    let goQuest = new quest(IP, token, result, email, req, res, next);
    if(type==="search"){
        const userQuestData = await goQuest.searchQuest();
        const userCard = await goQuest.getUserCardCount(false);
        goQuest.sendSuccess({
            list:userQuestData,
            card:userCard,
            dem:goQuest.userInfo.deminingStarCount,
            gc:goQuest.userInfo.guessCardCount,
            questCount:goQuest.userInfo.questCount,
            questTreasure:goQuest.userInfo.questTreasure,
            battleCard:goQuest.userInfo.battleCard,
        },'查询任务列表成功！');
    }else if(type==="accept"){
        await goQuest.acceptQuest();
    }else if(type==="change"){
        await goQuest.changeQuest();
    }else if(type==="complete"){
        await goQuest.complete();
    }else if(type==="treasure"){
        await goQuest.treasure();
    }
}