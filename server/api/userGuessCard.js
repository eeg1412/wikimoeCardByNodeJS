const chalk = require('chalk');
const utils = require('../utils/utils');
const userData = require('../utils/database/user');
const guessCardData = require('../utils/database/guessCard');
const userGuessCardData = require('../utils/database/userGuessCard');
const itemInfo = require('../data/item.json');
const itemDatabase = require('../utils/database/item');

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
    if(type==='buy'){
        let payStar = 258;
        // 计算当天猜卡次数
        let dailyGuessTime = Math.round(Number(result.guessStamp)*1000);
        let myGuessTimes = result.guessDailyCount;//战斗次数
        let dailyIsToday = false;//对战次数数据是否是当日
        if(new Date().toDateString()===new Date(dailyGuessTime).toDateString()){//如果是同天
            if(myGuessTimes===1){
                payStar = 78;
            }
            dailyIsToday = true;
        }else{
            payStar = 0;
            myGuessTimes = 0;
        }
        // 星星是否够
        if(result.star<payStar){
            res.send({
                code:0,
                msg:'星星不足！'
            });
            console.info(
                chalk.yellow(email+'的猜卡星星不足，IP为：'+IP)
            )
            return false;
        }
        // 查看持有卡牌是否合格
        if(result.cardIndexCount<30){
            res.send({
                code:0,
                msg:'卡牌收集量不足，先收集30种卡牌再来猜卡吧！'
            });
            console.info(
                chalk.yellow(email+'的卡牌收集量不足，IP为：'+IP)
            )
            return false;
        }
        // 校验数据合法性
        let buyCardArr = req.body.cardIndex;
        const id = req.body.id;
        const buyCardArrisArr = buyCardArr instanceof Array;
        if(!utils.objectIDCheck(id)){
            res.send({
                code:0,
                msg:'参数有误！'
            });
            console.info(
                chalk.yellow('email:'+email+'使用了不正确的数据库ID。IP为：'+IP)
            );
            return false;
        }
        if(!buyCardArrisArr){
            console.info(
                chalk.yellow(email+'传了非数组的猜卡数据，IP为：'+IP)
            )
            res.send({
                code:0,
                msg:'参数有误！'
            });
            return false;
        }
        if(buyCardArr.length<=0){
            console.info(
                chalk.yellow(email+'传了空的猜卡数据，IP为：'+IP)
            )
            res.send({
                code:0,
                msg:'参数有误！'
            });
            return false;
        }
        // 去重
        buyCardArr = utils.unique(buyCardArr);
        if(buyCardArr.length!==6){
            console.info(
                chalk.yellow(email+'传了超过限制或少于6个的猜卡数据，IP为：'+IP)
            )
            res.send({
                code:0,
                msg:'参数有误！'
            });
            return false;
        }
        // 检测数组内数据是否合法
        for(let i=0;i<buyCardArr.length;i++){
            const thisNumber = buyCardArr[i];
            const isNumber = typeof thisNumber === 'number' && !isNaN(thisNumber);
            if(!isNumber){
                console.info(
                    chalk.yellow(email+'传了非数字的猜卡数据，IP为：'+IP)
                )
                res.send({
                    code:0,
                    msg:'参数有误！'
                });
                return false;
            }else if(thisNumber<0||thisNumber>29){
                console.info(
                    chalk.yellow(email+'传了超过数字的猜卡数据，IP为：'+IP)
                )
                res.send({
                    code:0,
                    msg:'参数有误！'
                });
                return false;
            }
        }
        // 查询当前开放的猜卡
        const guessCardInfo = await guessCardData.findGuessCardOne({open:true}).catch((err)=>{
            res.send({
                code:0,
                msg:'内部错误请联系管理员！'
            });
            console.error(
                chalk.red('数据库查询错误！')
            );
            throw err;
        });
        if(!guessCardInfo){
            res.send({
                code:0,
                msg:'当前没有新的猜卡数据，请过会儿再来尝试吧！'
            });
            return false;
        }else if(guessCardInfo._id.toString()!==id){
            res.send({
                code:201,
                msg:'猜卡数据已刷新，请重新选择卡牌！'
            });
            return false;
        }
        // 一期最多只能买20次
        const userBuyCount = await userGuessCardData.findUserGuessCardMany({email:email,guessId:id}).catch ((err)=>{
            res.send({
                code:0,
                msg:'内部错误请联系管理员！'
            });
            console.error(
                chalk.red('数据库更新错误！')
            );
            throw err;
        });
        if(userBuyCount.length>=20){
            res.send({
                code:0,
                msg:'每期猜卡最多只能猜20次！请在下个整点再来猜吧！'
            });
            return false;
        }
        if(dailyIsToday){
            myGuessTimes = myGuessTimes+1;
        }else{
            myGuessTimes = 1;
        }
        // 扣星星
        let useStar = {
            star:-payStar
        }
        let userFilters = {
            email:email
        }
        let updataParams = {
            $inc:useStar,
            guessStamp:Math.round(new Date().getTime()/1000),
            guessDailyCount:myGuessTimes,
            ip:IP
        }
        await userData.updataUser(userFilters,updataParams,false).catch ((err)=>{
            res.send({
                code:0,
                msg:'内部错误请联系管理员！'
            });
            console.error(
                chalk.red('数据库更新错误！')
            );
            throw err;
        })
        // 写入数据
        const params = {
            email:email,
            selectIndex:buyCardArr,
            time:guessCardInfo.time,
            guessId:guessCardInfo._id
        }
        await userGuessCardData.saveUserGuessCard(params).catch((err)=>{
            console.error(
                chalk.red('数据库查询错误！')
            );
            throw err;
        });
        // 写入首页记录
        const timeNow = Math.round(new Date().getTime()/1000);
        let logCard = [];
        for(let i=0;i<buyCardArr.length;i++){
            const cardIndex_ = buyCardArr[i];
            logCard.push(guessCardInfo.card[cardIndex_]);
        }
        const logObject = {
            email:email,
            md5:result.md5,
            nickName:result.nickName,
            type:'guesscard',
            time:timeNow,
            data:{
                card:logCard,
            },
            ip:IP
        }
        utils.writeLog(logObject);   
        console.info(
            chalk.green(email+'成功提交了猜卡！')
        )  
        // 发送数据
        res.send({
            code:1,
            msg:'提交成功！'
        });
    }else if(type==='search'){
        const page = isNaN(Math.round(req.body.page))?1:Math.round(req.body.page);
        const guessCardInfo = await userGuessCardData.findUserGuessCard(10,page,{email:email},{'geted':1,'_id':-1},'-__v -email').catch((err)=>{
            res.send({
                code:0,
                msg:'内部错误请联系管理员！'
            });
            console.error(
                chalk.red('数据库查询错误！')
            );
            throw err;
        });
        // 统计都有哪些猜卡
        let timeArr = [];
        for(let i=0;i<guessCardInfo[0].length;i++){
            timeArr.push(guessCardInfo[0][i].guessId)
        }
        let guessCardFindData = [];
        if(timeArr.length>0){
            guessCardFindData = await guessCardData.findGuessCardMany({"_id":{"$in":timeArr}},'-__v').catch ((err)=>{
                res.send({
                    code:0,
                    msg:'内部错误请联系管理员！'
                });
                console.error(
                    chalk.red('数据库更新错误！')
                );
                throw err;
            })
        }
        // 发送数据
        res.send({
            code:1,
            total:guessCardInfo[1],
            data:guessCardInfo[0],
            guessData:guessCardFindData,
            msg:'ok'
        });
    }else if(type==='get'){
        // 数据检验
        const id = req.body.id;
        if(!utils.objectIDCheck(id)){
            res.send({
                code:0,
                msg:'参数有误！'
            });
            console.info(
                chalk.yellow('email:'+email+'使用了不正确的数据库ID。IP为：'+IP)
            );
            return false;
        }
        // 获取用户猜卡
        const getGuessCardData = await userGuessCardData.findUserGuessCardOne({email:email,geted:false,_id:id}).catch ((err)=>{
            res.send({
                code:0,
                msg:'内部错误请联系管理员！'
            });
            console.error(
                chalk.red('数据库更新错误！')
            );
            throw err;
        })
        // 判断是否有未领取数据
        if(!getGuessCardData){
            res.send({
                code:0,
                msg:'无该猜卡数据，或者已经领取奖励，请刷新页面！'
            });
            console.info(
                chalk.yellow(email+'无该猜卡数据，或者已经领取奖励')
            );
            return false;
        }
        // 获取本期猜卡信息
        const guessCardInfo = await guessCardData.findGuessCardOne({_id:getGuessCardData.guessId,open:false}).catch((err)=>{
            res.send({
                code:0,
                msg:'内部错误请联系管理员！'
            });
            console.error(
                chalk.red('数据库查询错误！')
            );
            throw err;
        });
        // 检查猜卡是否进入兑换期
        if(!guessCardInfo){
            res.send({
                code:0,
                msg:'该猜卡并未进入兑换期，请下个整点再尝试吧!'
            });
            return false;
        }
        // 可以获得的星星
        const giftStar = [0,10,30,160,2000,50000,5000000];
        // 检测一共猜中几张卡
        const cardIndexArr = getGuessCardData.selectIndex;
        let cardDataArr = [];
        for(let i=0;i<cardIndexArr.length;i++){
            // 判断是否中奖
            let thisCardArr = {
                attack:guessCardInfo.attackIndex.indexOf(cardIndexArr[i]),
                guessIndex:cardIndexArr[i]
            };
            cardDataArr.push(thisCardArr);
        }
        const attackIndexRes = cardDataArr.filter(item => item.attack !== -1);
        const attackCount = attackIndexRes.length;
        const timeNow = Math.round(new Date().getTime()/1000);
        // 没有猜到矿则送宝石
        if(attackCount<=0){
            const canGetItem = ['11','12','13','14','15','21','22','23','24','25','31','32','33','34','35','41','42','43','44','45','51','52','53','54','55'];
            const getedItemId = canGetItem[utils.randomNum(0,canGetItem.length-1)]
            const itemName = itemInfo[getedItemId].name;
            let getItemDataBase = {};
            getItemDataBase['item.'+getedItemId] = 2;
            let update_ = {
                $inc:getItemDataBase
            }
            await itemDatabase.findOneAndUpdate({email:email},update_).catch ((err)=>{
                console.error(
                    chalk.red('数据库更新错误！')
                );
                throw err;
            });
            // 用户猜卡数据更新
            await userGuessCardData.updataUserGuessCardOne({_id:id},{geted:true}).catch((err)=>{
                console.error(
                    chalk.red('数据库查询错误！')
                );
                throw err;
            });
            console.info(
                chalk.green(email+'获得了'+itemName+'×2！')
            )
            const logObject = {
                email:email,
                md5:result.md5,
                nickName:result.nickName,
                type:'guesscardNoCard',
                time:timeNow,
                data:{
                    itemName:itemName,
                },
                ip:IP
            }
            utils.writeLog(logObject);
            res.send({
                code:1,
                msg:'恭喜，您获得了'+itemName+'×2！'
            });
        }else{
            // 统计猜中的卡牌和获得的星星
            let attackCardIdAndStar = {};
            let attackCardInfoArr = [];
            for(let i=0;i<attackCount;i++){
                const packageId = guessCardInfo.card[attackIndexRes[i].guessIndex].packageId;
                const cardId = guessCardInfo.card[attackIndexRes[i].guessIndex].cardId;
                const attackCardInfo = {
                    packageId:packageId,
                    cardId:cardId
                }
                attackCardIdAndStar['card.'+packageId+'.'+cardId] = 1;
                attackCardInfoArr.push(attackCardInfo);
            }
            const getStar = giftStar[attackCount];
            attackCardIdAndStar['star'] = getStar;
            attackCardIdAndStar['guessCardCount'] = attackCount;
            // 写入数据库
            let filters = {
                email: email
            }
            let updataParams = {
                $inc:attackCardIdAndStar,
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
            // 用户猜卡数据更新
            await userGuessCardData.updataUserGuessCardOne({_id:id},{geted:true}).catch((err)=>{
                console.error(
                    chalk.red('数据库查询错误！')
                );
                throw err;
            });
            console.info(
                chalk.green(email+'猜卡所获：')
            )
            console.info(
                chalk.green(JSON.stringify(attackCardIdAndStar))
            )
            // 写入记录
            const logObject = {
                email:email,
                md5:result.md5,
                nickName:result.nickName,
                type:'guesscardHaveCard',
                time:timeNow,
                data:{
                    attackCount:attackCount,
                    getStar:getStar,
                    attackCardInfoArr:attackCardInfoArr
                },
                ip:IP
            }
            utils.writeLog(logObject);
            // 发送数据
            console.info(
                chalk.green(email+'获得了'+attackCount+'张卡牌和'+getStar+'颗星星')
            )
            res.send({
                code:1,
                msg:'恭喜您获得了'+attackCount+'张卡牌和'+getStar+'颗星星'
            });
        }
    }else{
        res.send({
            code:0,
            msg:'参数有误！'
        });
        console.info(
            chalk.yellow('email:'+email+'没有传猜卡类型。IP为：'+IP)
        );
    }
}