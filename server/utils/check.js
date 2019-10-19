const guessCard = require('../utils/database/guessCard');
const userGuessCard = require('../utils/database/userGuessCard');
var userData = require('../utils/database/user');
var fs = require('fs');
const chalk = require('chalk');
const schedule = require('node-schedule');

exports.checkGuessCard = async ()=>{
    // 查看现在有没有开放的猜卡
    const guessCardData = await guessCard.findGuessCardOne({open:true}).catch((err)=>{
        console.error(
            chalk.red(err)
        );
        return false;
    });
    const timeNow = Math.floor(new Date().getTime()/3600000);
    const dataTime = guessCardData?guessCardData.time:0;
    if(!guessCardData){
        console.info(
            chalk.yellow('目前不存在猜卡数据，系统将自动生成！')
        );
        guessCard.creatNewGuessCard();
        this.deletOldUserGuessCard();
    }else if(dataTime<timeNow){
        console.info(
            chalk.yellow('猜卡数据过期，系统将自动生成！')
        );
        guessCard.creatNewGuessCard();
        this.deletOldUserGuessCard();
    }
    schedule.scheduleJob('0 0 * * * *',()=>{
        guessCard.creatNewGuessCard();
        this.deletOldUserGuessCard();
    }); 
}
exports.deletOldUserGuessCard = async ()=>{
    const time = Math.floor(new Date().getTime()/3600000);
    let delParmas = {
        time:{$lt:time-720},
    }
    console.info(
        chalk.green('删除旧的用户猜卡数据!')
    )
    userGuessCard.deleUserGuessCard(delParmas).catch((err)=>{
        console.error(
            chalk.red('数据库查询错误！')
        );
        throw err;
    });
}
exports.checkRank = async ()=>{
    let rankData = fs.readFileSync('./config/cache/rank.json', 'utf8');
    rankData = JSON.parse(rankData);
    let DataTime = rankData['time'];
    let timeNow = new Date().getTime();
    if(timeNow-DataTime>86400000){
        console.info(
            chalk.yellow('排行榜过旧，系统将自动生成！')
        );
        this.creatRankFile();
    }
    schedule.scheduleJob('0 0 3 * * *',()=>{
        this.creatRankFile();
    }); 
}
// 创建排行榜数据
exports.creatRankFile = async ()=>{
    let timeNow = new Date().getTime();
    console.info(
        chalk.green('更新排行榜中...')
    )
    let newRankData = {};
    newRankData['time'] = timeNow;
    // 查询掘星
    let parmas = {};
    let pageSize_ = 5;
    let page_ = 1;
    let getParams = '-_id deminingStarCount md5 nickName';
    let sortData = {deminingStarCount:-1};
    let deminingStarCount_ =  await userData.findUserInPage(parmas,pageSize_,page_,getParams,sortData);
    newRankData['deminingStarCount'] = deminingStarCount_['data'];
    // 查询竞技点
    getParams = '-_id score md5 nickName';
    sortData = {score:-1};
    let score_ =  await userData.findUserInPage(parmas,pageSize_,page_,getParams,sortData);
    newRankData['score'] = score_['data'];
    // 查询等级
    getParams = '-_id level md5 nickName';
    sortData = {level:-1};
    let level_ =  await userData.findUserInPage(parmas,pageSize_,page_,getParams,sortData);
    newRankData['level'] = level_['data'];
    // 查询收集率
    getParams = '-_id cardIndexCount md5 nickName';
    sortData = {cardIndexCount:-1};
    let cardIndexCount_ =  await userData.findUserInPage(parmas,pageSize_,page_,getParams,sortData);
    newRankData['cardIndexCount'] = cardIndexCount_['data'];
    // 查询制卡数量
    getParams = '-_id UCC md5 nickName';
    sortData = {UCC:-1};
    let UCC_ =  await userData.findUserInPage(parmas,pageSize_,page_,getParams,sortData);
    newRankData['UCC'] = UCC_['data'];
    // 更新文件
    let rankData_ = JSON.stringify(newRankData);
    fs.writeFileSync('./config/cache/rank.json', rankData_, 'utf8');
    console.info(
        chalk.green('更新排行榜完毕...')
    )
}