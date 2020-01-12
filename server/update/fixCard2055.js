const config = require('config-lite')(__dirname);
global.myAppConfig = config;//全局设置变量
const mongoose = require('mongoose');
const chalk = require('chalk');
const marketData = require('../utils/database/market');
const wantCardData = require('../utils/database/wantCard');
const cardData = require('../utils/database/cardData');
var fs = require('fs');

mongoose.connect(global.myAppConfig.url,{useNewUrlParser:true,useFindAndModify: false,useUnifiedTopology: true});
mongoose.Promise = global.Promise;

var db = mongoose.connection;

db.once('open' ,async () => {
    console.log(
        chalk.green('连接数据库成功，开始升级')
    );

    // 获取卡牌
    // 检查是否存在该卡
    const cardMongoData = await cardData.findCardDataOne({cardId:"2055"}).catch ((err)=>{
        throw err;
    });
    if(!cardMongoData){
        console.info(
            chalk.yellow('卡牌ID有误！，请关闭窗口！')
        )
        return false;
    };
    if(cardMongoData.name!=="田中真奈美"){
        console.info(
            chalk.yellow('不存在田中真奈美，请关闭窗口！')
        )
        return false;
    }
    // 移动卡牌文件
    fs.rename('./update/2055.jpg', './public/card/0/2055.jpg', async (err) => {
        if (err) throw err;
        // 数据库更改
        let cardParams ={};
        let wantDataParmas = {};
        let marketDataParmas = {};
        cardParams ={
            name:"爱丽丝·卡塔雷特",
        }
        wantDataParmas = {
            name:"爱丽丝·卡塔雷特",
        }
        marketDataParmas = {
            name:"爱丽丝·卡塔雷特",
        }
        // 写入卡牌数据库
        await cardData.updataCardData({cardId:"2055"},cardParams).catch((err)=>{
            console.error(
                chalk.red(err)
            );
            return false;
        });
        console.info(
            chalk.green('写入卡牌数据成功')
        );
        // 更改求卡数据
        await wantCardData.updatatWantMany({cardId:cardMongoData.cardId},wantDataParmas).catch ((err)=>{
            console.error(
                chalk.red('数据库更新错误！')
            );
            throw err;
        });
        console.info(
            chalk.green('更改求卡数据成功')
        );
        // 更改市场数据
        await marketData.updataMarketMany({cardId:cardMongoData.cardId},marketDataParmas).catch ((err)=>{
            console.error(
                chalk.red('数据库更新错误！')
            );
            throw err;
        });
        console.info(
            chalk.green('更改市场数据成功')
        );
        console.info(
            chalk.green('更新成功，请关闭窗口！')
        );
    });
})

db.on('error', function(error) {
    console.error(
      chalk.red('Error in MongoDb connection: ' + error)
    );
    mongoose.disconnect();
});

db.on('close', function() {
    console.log(
      chalk.red('数据库断开，重新连接数据库')
    );
    mongoose.connect(global.myAppConfig.url, {server:{auto_reconnect:true}});
});
