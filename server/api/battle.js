// 基本属性：攻击力、防御力、速度、HP
// 伤血 = 攻击力-防御力，最低为0
// 攻击由速度快的一方先行攻击，如果一样则每次随机
// 属性克制为火→风→水→火 暗→水火风 光→暗
// 相克属性对战时攻击会+1
// 攻击=x 防=x/2 血=x*2
// 如果是1、2、3、4、5、6顺子排列的卡牌则攻击力和防御力和血的x+20
// 每三种同属性的卡牌攻击力和防御力和血的x+1

// 攻击方式例子：
// 86攻43防172血火物卡牌（先手） vs 86攻43防172血暗治卡牌
// 回合1=》
// 86+8（物）=94 攻击对方 43防 -51 对方HP剩余 121
// 对方86+8（属性克制） = 94 攻击我方 43防 -51 血121 敌方回血8 剩余121+8 = 129

// 86攻43防、血121光魔卡牌（先手） vs 86攻43防、血129 暗防卡牌
// 回合2 =》
// 86+8（属性克制） = 94 攻击对方 43+8（防）防 -43 对方HP剩余86 我方吸血8 我方HP129
// 对方86 攻击我方 43防 -43 我方剩余86HP

// 86攻43防、血86光特卡牌（先手） vs 86攻43防、血86 光妨卡牌
// 回合3 =》
// 86(妨使增伤失效) 攻击对方 43 -43 对方HP剩余43
// 对方 86攻击我方 43（妨使增防失效）防 -43 我方HP剩余43

// 86攻43防、血43光特卡牌（先手） vs 86攻43防、血43 光魔卡牌
// 回合4=》
// 86+8（特） = 94 攻击对方 43防 -51 对方猝 我方赢

//红1
//蓝2
//绿3
//光4
//暗5

// 主动技能：
// 特7：我方攻击前攻击力临时+x*10%、敌方攻击时防御力临时+x*10%
// 魔2：敌方攻击后反弹攻击造成的伤害的20%
// 物1：我方攻击前攻击力临时+x*10%
// 防3：敌方攻击前防御力临时+x*10%
// 治4：我方攻击前我方HP+x*10%
// 支6：敌方攻击前临时产生x*20%的临时HP
// 妨5：使对方的主动技能失效

//被动能力
//全1
//兵2
//盾3
//速4
//爱5

var utils = require('../utils/utils');
var userData = require('../utils/database/user');
var userbattleinfoData = require('../utils/database/userbattleinfo');
var chalk = require('chalk');
var cardData = require('../data/cardData');
var usersModel = require('../models/users');

// 结算胜负
function isWin(MyADSHP,EmADSHP){
    if(MyADSHP[3]<=0&&EmADSHP[3]<=0){
        return 2;//平局
    }else if(EmADSHP[3]<=0){
        return 1;//赢
    }else if(MyADSHP[3]<=0){
        return 0;//输
    }else{
        return 3;
    }
}
// 对战
function cardBattle(AttackADSHP,AttackCard,DefendEmADSHP,DefendCard){
    // 主动技能：
    // 特7：我方攻击前攻击力临时+x*10%、敌方攻击时防御力临时+x*10%
    // 魔2：敌方攻击后反弹攻击造成的伤害的20%
    // 物1：我方攻击前攻击力临时+x*10%
    // 防3：敌方攻击前防御力临时+x*10%
    // 治4：我方攻击前我方HP+x*10%
    // 支6：敌方攻击前临时产生x*20%的临时HP
    // 妨5：使对方的主动技能失效
    // 克制表属性克制为火→风→水→火 暗→水火风 光→暗

    // 20190516修改
    // 物：攻= +攻*10%*星级
    // 防：防= +防*10%*星级
    // 支：产生对方伤害*10*星级的护盾
    // 特：攻=攻*6%*星级、防=攻*6%*星级
    // 治：SAN = +攻*10*星级
    // 魔：反弹对方伤害的10%*星级

    // 克：增伤10%*星级差(最多10%)
    // 被克：防御减少10%*星级差(最多10%)
    let cryKe = {
        '1':[3,4],
        '2':[1],
        '3':[2],
        '4':[5],
        '5':[1,2,3]
    }
    let AttackRightType = AttackCard.rightType;
    // let AttackCry = AttackCard.cry;
    let AttackA = AttackADSHP[0];
    // let AttackD = AttackADSHP[1];
    let AttackHP = AttackADSHP[3];
    // let AttackShield = 0;//临时护盾
    let AttackStar = AttackCard.star;//攻击卡牌的星级
    let AttackAddHP = 0;//加血多少

    let DefendRightType = DefendCard.rightType;
    // let DefendCry = DefendCard.cry;
    let DefendA = DefendEmADSHP[0];
    let DefendD = DefendEmADSHP[1];
    let DefendHP = DefendEmADSHP[3];
    let DefendShield = 0;//临时护盾
    let DefendStar = DefendCard.star;//防守卡牌的星级

    // 攻击方攻击前
    if(DefendRightType!==5){
        if(AttackRightType===1){
            AttackA = AttackA+Math.floor(AttackA*0.1*AttackStar);
        }else if(AttackRightType===7){
            AttackA = AttackA+Math.floor(AttackA*0.06*AttackStar);
        }else if(AttackRightType===4){
            AttackAddHP = Math.floor(AttackA*0.1*AttackStar);
            AttackHP = AttackHP+AttackAddHP;
        }
    }
    // 攻击前结算属性相克
    let ke = cryKe[AttackCard.cry].indexOf(DefendCard.cry);
    let beike = cryKe[DefendCard.cry].indexOf(AttackCard.cry);
    if(ke!==-1){//克制增伤
        let starCha = AttackStar - DefendStar//星级差
        if(starCha<1){
            starCha = 1;
        }
        AttackA = AttackA+Math.floor(AttackA*0.1*starCha);
    }
    if(beike!==-1){//被克减伤
        let starCha = DefendStar - AttackStar//星级差
        if(starCha<1){
            starCha = 1;
        }
        DefendD = DefendD+Math.floor(DefendA*0.1*starCha);
    }
    // 防守方接受攻击前
    if(AttackRightType!==5){
        if(DefendRightType===3){
            DefendD = DefendD+Math.floor(DefendA*0.1*DefendStar);
        }else if(DefendRightType===7){
            DefendD = DefendD+Math.floor(DefendA*0.06*DefendStar);
        }else if(DefendRightType===6){
            DefendShield = Math.floor(AttackA*0.085*DefendStar);
        }
    }
    // 开始攻击
    let AttackPow = AttackA - DefendD - DefendShield;
    if(AttackPow<0){
        AttackPow = 0;
    }
    // 结算扣血
    DefendHP = DefendHP - AttackPow;
    // 结算伤害反弹
    let DefendPow = 0;
    if(DefendRightType===2&&AttackRightType!==5){
        DefendPow = Math.floor(AttackPow*0.10*DefendStar);
        AttackHP = AttackHP - DefendPow;
    }
    // 防止HP为负数
    if(DefendHP<0){
        DefendHP = 0;
    }
    if(AttackHP<0){
        AttackHP = 0;
    }
    return [AttackPow,AttackHP,DefendPow,DefendHP,AttackAddHP];
}
// 寻找对手
async function searchEm(parmas){
    let query = usersModel.find(parmas);
    let total = await query.countDocuments();
    let data = await query
        .find()
        .skip(utils.randomNum(0,total-1))
        .limit(1);
    return data;
}
// 出战卡牌信息写入
function setBattleCardInfo(cardArr){
    let cardArrInfo = [];
    for(let i =0;i<cardArr.length;i++){
        let cardId = utils.PrefixInteger(cardArr[i],4);
        cardArrInfoItem = cardData['cardData'][cardId];
        cardArrInfoItem['cardId'] = cardArr[i];
        cardArrInfo.push(cardArrInfoItem);
    }
    return cardArrInfo;
}
// 统计星级
function starCount(cardArr){
    let starArr = [0,0,0,0,0,0];
    let starCount_ = 0;
    for(let i =0;i<cardArr.length;i++){
        let star = cardArr[i].star-1;
        starArr[star] = starArr[star]+1;
        starCount_ = starCount_ + star+1;
    }
    return [starArr,starCount_];
}
// 统计水晶
function cryCount(cardArr){
    let cryArr = [0,0,0,0,0]
    for(let i =0;i<cardArr.length;i++){
        let cry = cardArr[i].cry-1;
        cryArr[cry] = cryArr[cry]+1;
    }
    return cryArr;
}
// 统计攻防速血
function setADSHP(cardArr,starArr,starCount,cryArr,cardIndexCount){
    let x = starCount;//初始化x为星星的数量
    // 如果是1、2、3、4、5、6顺子排列的卡牌则攻击力和防御力和血的x+20
    let minStarCount = Math.min.apply(null, starArr);
    let cardCountPlus = Math.floor(cardIndexCount/25);//每25收集率x+1
    x = x + minStarCount*20 + cardCountPlus;
    // 每三种同属性的卡牌攻击力和防御力和血的x+1
    for(let i=0;i<cryArr.length;i++){
        let cryPlusX = Math.floor(cryArr[i]/3);
        x = x + cryPlusX;
    }
    // 攻击=x*100 防=x*50 血=x*200
    let A = x*100;
    let D = x*50;
    let HP = x*500;
    // 设置速度
    let S = 0;
    for(let j =0;j<cardArr.length;j++){
        //速4
        let leftType = cardArr[j].leftType;
        if(leftType===4){
            S = S+1;
        }else if(leftType===1){//全1
            A = A + 50;
            D = D + 25;
        }else if(leftType===2){//兵2
            A = A + 100;
        }else if(leftType===3){//盾3
            D = D + 50;
        }else if(leftType===5){//爱5
            HP = HP + 500;
        }  
    }
    return [A,D,S,HP];
}
// 设置AI卡牌
function creatAICard(starArr_,MyCardIndexCount,advanced){
    let cardArr = []
    let starArr = [...starArr_];
    if(MyCardIndexCount<200&&!advanced){//卡牌种类低于200张则弱化AI
        console.info(
            chalk.green('弱化对战AI我方卡牌星级统计:'+starArr)
        )
        if(starArr[4]>1){
            starArr[4] = starArr[4]-2;
            starArr[2] = starArr[2]+2;
        }else if(starArr[3]>1){
            starArr[3] = starArr[3]-2;
            starArr[2] = starArr[2]+2;
        }else if(starArr[4]>0){
            starArr[4] = starArr[4]-1;
            starArr[2] = starArr[2]+1;
        }else if(starArr[3]>0){
            starArr[3] = starArr[3]-1;
            starArr[2] = starArr[2]+1;
        }
    }
    //如果有1、2星卡
    if(starArr[0]===1){
        cardArr.push('2');
        starArr[0] = starArr[0] -1;
    }else if(starArr[0]>1){
        cardArr.push('2');
        cardArr.push('1');
        starArr[0] = starArr[0] -2;
    }
    if(starArr[1]===1){
        cardArr.push('4');
        starArr[1] = starArr[1] -1;
    }else if(starArr[1]>1){
        cardArr.push('3');
        cardArr.push('4');
        starArr[1] = starArr[1] -2;
    }
    for(let i=0;i<starArr.length;i++){
        for(let j=0;j<starArr[i];j++){
            if(i<=2){
                let cardId = utils.wmCreatCardId(1);
                if(cardArr.indexOf(cardId) == -1){
                    cardArr.unshift(cardId);
                }else{
                    j = j -1;
                }
            }else if(i===3){
                let cardId = utils.wmCreatCardId(65);
                if(cardArr.indexOf(cardId) == -1){
                    cardArr.unshift(cardId);
                }else{
                    j = j -1;
                }
            }else if(i===4){
                let cardId = utils.wmCreatCardId(87);
                if(cardArr.indexOf(cardId) == -1){
                    cardArr.unshift(cardId);
                }else{
                    j = j -1;
                }
            }else if(i===5){
                let cardId = utils.wmCreatCardId(98);
                if(cardArr.indexOf(cardId) == -1){
                    cardArr.unshift(cardId);
                }else{
                    j = j -1;
                }
            }
        }
    }
    return cardArr;
}
// 卡牌排序
function cardSort(a,b){
    return b-a;
}
module.exports = async function(req, res, next){
    let IP = utils.getUserIp(req);
    let token = req.body.token;
    let advanced = req.body.advanced;
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
    let mycardIndexCount = result.cardIndexCount;
    if(mycardIndexCount<20){
        res.send({
            code:0,
            msg:'卡牌必须大于20张才能对战哦！赶快抽卡吧！'
        });
        console.info(
            chalk.green(email+'卡牌小于20不能对战。IP为：'+IP)
        )
        return false;
    }
    console.info(
        chalk.green(email+'开始匹配对战对手。IP为：'+IP)
    )
    let myScore = result.score;
    // 设一定概率遇到AI
    let AiP = utils.randomNum(1,100);//AI概率因子
    let emData = [];
    let seeAiP = 40;
    if(result.level<=15){//新手大概率遇到AI
        console.info(
            chalk.green(email+'是新手，高概率遇到AI。IP为：'+IP)
        )
        seeAiP = 80;
    }
    if(AiP>seeAiP){//40%概率遇见AI
        if(advanced){//如果是进阶匹配
            let emScore = {
                score:{$gte:myScore+500},
                email:{$ne:email},
                cardIndexCount:{$gte:20}
            };
            // 竞技点分数段内的
            emData = await searchEm(emScore);
        }else{
            let emMinScore = myScore-500<0?0:myScore-500;
            let emMaxScore = myScore+500;
            let emScore = {
                score:{$gte:emMinScore,$lte:emMaxScore},
                email:{$ne:email},
                cardIndexCount:{$gte:20}
            };
            // 竞技点分数段内的
            emData = await searchEm(emScore);
        }
    }
    // 初始化一些信息
    let AiMode = emData.length>0?false:true;//没有对手的话进入ai模式
    // 初始化个人信息
    let MyName = result.nickName;
    let MyMD5 = result.md5;
    let EmName = '';
    let EmMD5 = '';
    // 初始化卡组
    let MyBattleCard = result.battleCard;//我的对战卡牌
    let EmBattleCard = [];//对方的对战卡牌
    // 初始化我的属性
    let MyCardStarCount = [0,0,0,0,0,0]//我的卡牌星级个数统计
    let MyStarAll = 0;//我的所以卡牌加起来的星级
    let MyCryCount = [0,0,0,0,0];//我的卡牌属性个数统计
    let MyADSHP = [0,0,0,0];//我的攻、防、速、血
    let MyCardIndexCount = result.cardIndexCount;//卡牌收集率
    // 初始化对方属性
    let EmCardStarCount = [0,0,0,0,0,0];//对方卡牌星级个数统计
    let EmCryCount = [0,0,0,0,0];//对方卡牌属性个数统计
    let EmStarAll = 0;//对方所以卡牌加起来的星级
    let EmADSHP = [0,0,0,0];//对方的攻、防、速、血
    let EmCardIndexCount = 0;
    // 初始化胜负
    let win = 2;

    // 如果没有设置对战卡牌则系统抽选卡牌
    if(MyBattleCard.length!==20){
        console.info(
            chalk.green(email+'并未设置出战卡牌，故由系统挑选卡牌。IP为：'+IP)
        )
        MyBattleCard = Object.keys(result.card);
        MyBattleCard = MyBattleCard.slice(MyBattleCard.length-20,MyBattleCard.length);
        MyBattleCard = MyBattleCard.sort(cardSort);
    }
    // 设置我的出战卡牌信息
    MyBattleCardArr_ = [...MyBattleCard]
    MyBattleCard = setBattleCardInfo(MyBattleCard);
    // 我的卡牌星级统计
    let MyCardStarRes = starCount(MyBattleCard);
    MyCardStarCount = MyCardStarRes[0];
    MyStarAll = MyCardStarRes[1];
    // 我的水晶统计
    MyCryCount = cryCount(MyBattleCard);
    // 我的攻防速血统计
    MyADSHP = setADSHP(MyBattleCard,MyCardStarCount,MyStarAll,MyCryCount,MyCardIndexCount);
    // 设置敌方卡牌
    if(AiMode){//无匹配的情况下给一个AI
        console.info(
            chalk.green(email+'无匹配的情况下给一个AI。IP为：'+IP)
        )
        EmBattleCard = creatAICard(MyCardStarCount,MyCardIndexCount,advanced);
        // EmBattleCard = EmBattleCard.sort(cardSort);
        EmName = '自动书记人偶'+ utils.randomNum(0,99) + '号';
        EmCardIndexCount = MyCardIndexCount;
        if(advanced){
            EmCardIndexCount = EmCardIndexCount+200;
        }
    }else{
        // 有匹配设置对方的卡牌
        emData = emData[0];
        EmName = emData.nickName;
        EmMD5 = emData.md5;
        EmBattleCard = emData.battleCard;
        EmCardIndexCount = emData.cardIndexCount;
        if(EmBattleCard.length!==20){
            // 对方并未设置对战卡牌
            console.info(
                chalk.green('对手'+emData.email+'并未设置对战卡牌，故由系统挑选。IP为：'+IP)
            )
            EmBattleCard = Object.keys(emData.card);
            EmBattleCard = EmBattleCard.slice(EmBattleCard.length-20,EmBattleCard.length);
            EmBattleCard = EmBattleCard.sort(cardSort);
        }
    }
    // 设置对方出战卡牌信息
    EmBattleCardArr_ = [...EmBattleCard]
    EmBattleCard = setBattleCardInfo(EmBattleCard);
    // 对方卡牌星级统计
    let EmCardStarRes = starCount(EmBattleCard);
    EmCardStarCount = EmCardStarRes[0];
    EmStarAll = EmCardStarRes[1];
    // 对方的水晶统计
    EmCryCount = cryCount(EmBattleCard);
    // 敌方攻防速血统计
    EmADSHP = setADSHP(EmBattleCard,EmCardStarCount,EmStarAll,EmCryCount,EmCardIndexCount);
    // 初始敌我数值
    EmADSHP_ = [...EmADSHP];
    MyADSHP_ = [...MyADSHP];
    // 开始战斗
    let MyBattleData = [];
    let EmBattleData = [];
    let speed = 1;//1为我方打，0为对方打
    if(MyADSHP[2]<EmADSHP[2]){
        speed = 0;
    }else if(MyADSHP[2]===EmADSHP[2]){
        speed = utils.randomNum(0,1);
    }else if(AiMode){//如果进阶随机
        speed = utils.randomNum(0,1);
    }
    for(let i=0;i<20;i++){//最多不超过20局
        if(speed){//如果我方速度快
            // 我方攻击
            let MybattleDataRound = cardBattle(MyADSHP,MyBattleCard[i],EmADSHP,EmBattleCard[i]);
            MyADSHP[3] = MybattleDataRound[1];
            EmADSHP[3] = MybattleDataRound[3];
            MyBattleData.push(MybattleDataRound);
            win = isWin(MyADSHP,EmADSHP);
            if(win!==3){
                break;
            }
            // 对方攻击
            let EmbattleDataRound = cardBattle(EmADSHP,EmBattleCard[i],MyADSHP,MyBattleCard[i]);
            MyADSHP[3] = EmbattleDataRound[3];
            EmADSHP[3] = EmbattleDataRound[1];
            EmBattleData.push(EmbattleDataRound);
            win = isWin(MyADSHP,EmADSHP);
            if(win!==3){
                break;
            }
        }else{
            // 对方攻击
            let EmbattleDataRound = cardBattle(EmADSHP,EmBattleCard[i],MyADSHP,MyBattleCard[i]);
            MyADSHP[3] = EmbattleDataRound[3];
            EmADSHP[3] = EmbattleDataRound[1];
            EmBattleData.push(EmbattleDataRound);
            win = isWin(MyADSHP,EmADSHP);
            if(win!==3){
                break;
            }
            // 我方攻击
            let MybattleDataRound = cardBattle(MyADSHP,MyBattleCard[i],EmADSHP,EmBattleCard[i]);
            MyADSHP[3] = MybattleDataRound[1];
            EmADSHP[3] = MybattleDataRound[3];
            MyBattleData.push(MybattleDataRound);
            win = isWin(MyADSHP,EmADSHP);
            if(win!==3){
                break;
            }
        }
    }
    if(win===3){//打完还是3说明是平局
        win = 2;
    }
    // 计算当天战斗次数
    let battleOverTimes = 5;//每天最多可以赢几次
    let dailyBattleTime = Math.round(Number(result.battleStamp)*1000);
    let myBattleTimes = result.battleDailyCount;//战斗次数
    let battleOverChance = false;//是否超过当日对战次数
    let dailyIsToday = false;//对战次数数据是否是当日
    if(new Date().toDateString()===new Date(dailyBattleTime).toDateString()){//如果是同天
        if(myBattleTimes>=battleOverTimes){//如果今日已经战斗五次
            battleOverChance = true;
        }
        dailyIsToday = true;
    }else{
        myBattleTimes = 0;
    }
    // 如果并未超过当日的对战次数则结算竞技点、经验
    let getScore = 0;//获取竞技点
    let getExp = 0;//获取经验
    let EmScore = 0;//对方的竞技点
    let EmGetScore = 0;
    let levelUpStar = 0;
    let battleGetStar = 0;
    let MyScore = result.score;//我的竞技点
    if(!battleOverChance){
        let userFilters = null;
        let updataParams = null;
        let EmUserFilters = null;
        let EmUpdataParams = null;
        if(AiMode){//如果是AI模式则竞技点与自己一样
            EmScore = MyScore;
            if(advanced){
                EmScore = EmScore+70;
            }
        }else{
            EmScore = emData.score;
        }
        if(win===1){//如果是赢
            getScore = Math.round((EmScore - MyScore)/2);
            if(getScore<10){
                getScore = 10;
            }else if(getScore>90){//最多获得90竞技点
                getScore = 90;
            }
            if(advanced&&getScore>=90){
                getScore = 120;
            }
            EmGetScore = -getScore;
            getExp = getScore+10;
            if(dailyIsToday){
                myBattleTimes = myBattleTimes+1;
            }else{
                myBattleTimes = 1;
            }
            //如果今日挑战已经胜利5次则赠送50星星
            if(myBattleTimes===battleOverTimes){
                battleGetStar = 10*battleOverTimes;
            }
            // 写入我方胜利数据
            let myLevle = result.level;
            let MyExp = result.exp+getExp;
            let levelExp = utils.levelCheck(myLevle,MyExp);
            levelUpStar = levelExp[2]*30;
            userFilters = {
                email:email
            }
            updataParams = {
                $inc:{
                    star:levelUpStar+battleGetStar
                },
                battleStamp:Math.round(new Date().getTime()/1000),
                battleDailyCount:myBattleTimes,
                score:result.score + getScore,
                level:levelExp[0],
                exp:levelExp[1],
                ip:IP
            }
            if(!AiMode){
                let EmNewScore = EmScore + EmGetScore;
                if(EmNewScore<0){//防止竞技点小于0
                    EmNewScore = 0;
                }
                EmUserFilters = {
                    email:emData.email
                }
                EmUpdataParams = {
                    score:EmNewScore
                }
            }
            console.info(
                chalk.green(email+'对战胜利。IP为：'+IP)
            )
        }else if(win===0){//如果是输
            getScore = Math.round((EmScore - MyScore)/2);
            if(getScore>-10){//如果对方竞技点比我们高也要至少扣十点竞技点
                getScore = -10;
            }else if(getScore<-90){//最多扣90分
                getScore = -90;
            }
            if(advanced&&getScore<=-90){
                getScore = -120;
            }
            EmGetScore = Math.abs(getScore);
            let myNewScore = result.score + getScore;
            if(myNewScore<0){//防止竞技点小于0
                myNewScore = 0;
            }
            userFilters = {
                email:email
            }
            updataParams = {
                score:myNewScore,
                ip:IP
            }
            if(!AiMode){
                let EmNewScore = EmScore + EmGetScore;
                EmUserFilters = {
                    email:emData.email
                }
                EmUpdataParams = {
                    score:EmNewScore
                }
            }
            console.info(
                chalk.green(email+'战败。IP为：'+IP)
            )
        }
        if(userFilters){
            await userData.updataUser(userFilters,updataParams).catch ((err)=>{
                res.send({
                    code:0,
                    msg:'内部错误请联系管理员！'
                });
                console.error(
                    chalk.red('数据库更新错误！')
                );
                throw err;
            })
            //写入用户战斗数据
            let userbattleinfoDataUpdata = {};
            if(win===1){
                userbattleinfoDataUpdata = {$inc:{win:1}}
            }else if(win===0){
                userbattleinfoDataUpdata = {$inc:{lose:1}}
            }else{
                userbattleinfoDataUpdata = {$inc:{draw:1}}
            }
            await userbattleinfoData.findOneAndUpdate(userFilters,userbattleinfoDataUpdata).catch ((err)=>{
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
        if(EmUserFilters){
            await userData.updataUser(EmUserFilters,EmUpdataParams).catch ((err)=>{
                res.send({
                    code:0,
                    msg:'内部错误请联系管理员！'
                });
                console.error(
                    chalk.red('数据库更新错误！')
                );
                throw err;
            })
            //写入用户战斗数据
            let userbattleinfoDataUpdata = {};
            if(win===1){
                userbattleinfoDataUpdata = {$inc:{lose:1}}
            }else if(win===0){
                userbattleinfoDataUpdata = {$inc:{win:1}}
            }else{
                userbattleinfoDataUpdata = {$inc:{draw:1}}
            }
            await userbattleinfoData.findOneAndUpdate(EmUserFilters,userbattleinfoDataUpdata).catch ((err)=>{
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
        let timeNow = Math.round(new Date().getTime()/1000);
        let logObject = {
            email:email,
            md5:result.md5,
            nickName:result.nickName,
            type:'battle',
            time:timeNow,
            data:{
                win:win,
                EmName:EmName,
                EmMD5:EmMD5,
                getScore:getScore,
                getExp:getExp
            },
            ip:IP
        }
        utils.writeLog(logObject);
    }
    // 记得赢了才更新对战时间和次数
    
    res.send({
        code:1,
        // MyCardStarCount:MyCardStarCount,
        // MyStarAll:MyStarAll,
        // MyCryCount:MyCryCount,
        MyBattleCard:MyBattleCardArr_,
        MyADSHP:MyADSHP_,
        MyName:MyName,
        MyMD5:MyMD5,
        // EmCardStarCount:EmCardStarCount,
        // EmStarAll:EmStarAll,
        // EmCryCount:EmCryCount,
        EmBattleCard:EmBattleCardArr_,
        EmADSHP:EmADSHP_,
        EmName:EmName,
        EmMD5:EmMD5,
        MyBattleData:MyBattleData,
        EmBattleData:EmBattleData,
        win:win,
        speed:speed,
        myBattleTimes:myBattleTimes,
        battleOverChance:battleOverChance,
        score:myScore,
        getScore:getScore,
        getExp:getExp,
        levelUpStar:levelUpStar,
        battleGetStar:battleGetStar,
        battleOverTimes:battleOverTimes,
        msg:'获取成功'
    });
}