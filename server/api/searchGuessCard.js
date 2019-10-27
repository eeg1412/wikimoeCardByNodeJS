const chalk = require('chalk');
const utils = require('../utils/utils');
const guessCardData = require('../utils/database/guessCard');
const cardPackageData = require('../utils/database/cardPackage');

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
    if(type==='history'){
        const page = isNaN(Math.round(req.body.page))?1:Math.round(req.body.page);
        const guessCardInfo = await guessCardData.findGuessCard(1,page,{open:false},{'time':-1},'-_id -__v').catch((err)=>{
            res.send({
                code:0,
                msg:'内部错误请联系管理员！'
            });
            console.error(
                chalk.red('数据库查询错误！')
            );
            throw err;
        });
        // 发送数据
        res.send({
            code:1,
            total:guessCardInfo[1],
            data:guessCardInfo[0],
            msg:'ok'
        });
    }else{
        let guessCardInfo = await guessCardData.findGuessCardOne({open:true}).catch((err)=>{
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
                msg:'当前无猜卡数据！'
            });
            console.error(
                chalk.red('当前无猜卡数据！')
            );
            return false;
        }
        // 查询卡包数据
        // 以后更新猜卡卡包后增加条件
        const params = {};
        const packageInfo = await cardPackageData.findCardPackageMany(params,'name packageId').catch((err)=>{
            res.send({
                code:0,
                msg:'内部错误请联系管理员！'
            });
            console.error(
                chalk.red('数据库查询错误！')
            );
            throw err;
        });
        // 查询卡牌拥有数量
        let myCardCount = {};
        for(let i=0;i<guessCardInfo.card.length;i++){
            const cardId = guessCardInfo.card[i].cardId;
            const packageId = guessCardInfo.card[i].packageId;
            try {
                myCardCount[cardId] = result.card[packageId][cardId]?result.card[packageId][cardId]:0;
            }
            catch(err) {
                myCardCount[cardId] = 0;
            }
        }
        // 查询第几次猜卡
        let dailyGuessTime = Math.round(Number(result.guessStamp)*1000);
        let myGuessTimes = result.guessDailyCount;//猜卡次数
        if(!(new Date().toDateString()===new Date(dailyGuessTime).toDateString())){//如果不是同天
            myGuessTimes = 0;
        }
        // 发送数据
        res.send({
            code:1,
            myCardCount:myCardCount,
            packageInfo:packageInfo,
            battleCard:result.battleCard,
            data:guessCardInfo,
            myGuessTimes:myGuessTimes,
            msg:'ok'
        });
    }
}