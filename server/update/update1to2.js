const config = require('config-lite')(__dirname);
global.myAppConfig = config;//全局设置变量
const mongoose = require('mongoose');
const chalk = require('chalk');
const cardPackageData = require('../utils/database/cardPackage');
const userData = require('../utils/database/user');

mongoose.connect(global.myAppConfig.url,{useNewUrlParser:true,useFindAndModify: false,useUnifiedTopology: true});
mongoose.Promise = global.Promise;

var db = mongoose.connection;

db.once('open' ,async () => {
    console.log(
        chalk.green('连接数据库成功，开始升级')
    );

    // 需要升级限定卡包
    console.info(
        chalk.yellow('开始对卡包数据进行升级！')
    );
    const params = {
        guessOpen:true,
        starCoinOpen:true,
        starShopOpen:true,
    }
    await cardPackageData.updataCardPackageMany({},params).catch((err)=>{
        console.error(
            chalk.red(err)
        );
        return false;
    });
    console.info(
        chalk.yellow('卡包数据升级完毕！')
    );
    // 需要升级本月是否战斗过
    // 需要升级battleHitStamp被攻击时间戳
    console.info(
        chalk.yellow('开始更新对战数据')
    );
    const updataParams = {
        battled:true,
        battleHitStamp:0
    }
    await userData.updataUserMany({},updataParams).catch ((err)=>{
        res.send({
            code:0,
            msg:'内部错误请联系管理员！'
        });
        console.error(
            chalk.red('数据库更新错误！')
        );
        throw err;
    })
    console.info(
        chalk.yellow('对战数据更新完毕！')
    );
    
    console.log(
        chalk.green('升级完毕！请关闭窗口！')
    );
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
