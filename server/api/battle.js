// 基本属性：攻击力、防御力、速度、HP
// 伤血 = 攻击力-防御力，最低为1
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

//物1
//魔2
//防3
//治4
//妨5
//支6
//特7

// 主动技能：
// 特：我方攻击前攻击力临时+x*10%、敌方攻击时防御力临时+x*10%
// 魔：我方攻击后吸收攻击造成的伤害的20%
// 物：我方攻击前攻击力临时+x*10%
// 防：敌方攻击前防御力临时+x*10%
// 治：敌方攻击后我方HP+x*10%
// 支：敌方攻击前临时产生x*20%的临时HP
// 妨：使对方的主动技能失效

//被动能力
//全1
//兵2
//盾3
//速4
//爱5

var utils = require('../utils/utils');
var userData = require('../utils/database/user');
var chalk = require('chalk');
var cardData = require('../data/cardData');
var usersModel = require('../models/users');

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
// 统计星级
function starCount(cardArr){
    let starArr = [0,0,0,0,0,0];
    let starCount_ = 0;
    for(let i =0;i<cardArr.length;i++){
        let cardId = utils.PrefixInteger(cardArr[i],4);
        let star = cardData['cardData'][cardId].star-1;
        starArr[star] = starArr[star]+1;
        starCount_ = starCount_ + star+1;
    }
    return [starArr,starCount_];
}
module.exports = async function(req, res, next){
    let IP = utils.getUserIp(req);
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
    let mycardIndexCount = result.cardIndexCount;
    if(mycardIndexCount<20){
        res.send({
            code:1,
            msg:'卡牌必须大于20张才能对战！'
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
    // 竞技点分数段内的
    let emMinScore = myScore-500<0?0:myScore-500;
    let emMaxScore = myScore+500;
    let emScore = {
        score:{$gte:emMinScore,$lte:emMaxScore},
        email:{$ne:email},
        cardIndexCount:{$gte:20}
    };
    let emData = await searchEm(emScore);
    // 初始化一些信息
    let AiMode = emData?true:false;//没有对手的话进入ai模式
    let MyBattleCard = result.battleCard;//我的对战卡牌
    let EmBattleCard = [];//对方的对战卡牌
    let MyCardStarCount = [0,0,0,0,0,0]//我的卡牌星级个数统计
    let MyStarAll = 0;//我的所以卡牌加起来的星级
    let MyCryCount = [0,0,0,0,0]//我的卡牌属性个数统计
    let EmCardStarCount = [0,0,0,0,0,0]//对方卡牌星级个数统计
    let EmCryCount = [0,0,0,0,0]//对方卡牌属性个数统计
    let EmStarAll = 0;//对方所以卡牌加起来的星级

    // 如果没有设置对战卡牌则系统抽选卡牌
    if(MyBattleCard.length<=0){
        console.info(
            chalk.green(email+'并未设置出战卡牌，故由系统挑选卡牌。IP为：'+IP)
        )
        AiMode = true;
        MyBattleCard = Object.keys(result.card);
        MyBattleCard = MyBattleCard.slice(MyBattleCard.length-21,MyBattleCard.length-1);
    }
    // 卡牌星级统计
    let MyCardStarRes = starCount(MyBattleCard);
    MyCardStarCount = MyCardStarRes[0];
    MyStarAll = MyCardStarRes[1];
    
    res.send({
        code:1,
        data:emData,
        battlecard:MyStarAll,
        msg:'获取成功'
    });
}