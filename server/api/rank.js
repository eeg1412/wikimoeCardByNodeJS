var userData = require('../utils/database/user');
var chalk = require('chalk');
var fs = require('fs');

module.exports = async function(req, res, next){
    let rankData = fs.readFileSync('./config/cache/rank.json', 'utf8');
    rankData = JSON.parse(rankData);
    let DataTime = rankData['time'];
    let timeNow = new Date().getTime();
    if(timeNow-DataTime>86400000){
        // 数据一天未更新，需要更新
        console.info(
            chalk.yellow('排行榜数据一天未更新，需要更新！')
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
        // 更新文件
        let rankData_ = JSON.stringify(newRankData);
        fs.writeFileSync('./config/cache/rank.json', rankData_, 'utf8');
        rankData = newRankData;
    }
    res.send({
        code:1,
        data:rankData,
        msg:'ok'
    });
}