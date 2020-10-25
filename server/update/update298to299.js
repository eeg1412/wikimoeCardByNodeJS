const config = require('config-lite')(__dirname);
global.myAppConfig = config;//全局设置变量
const mongoose = require('mongoose');
const chalk = require('chalk');

mongoose.connect(global.myAppConfig.url, { useNewUrlParser: true, useFindAndModify: false, useUnifiedTopology: true });
mongoose.Promise = global.Promise;
var db = mongoose.connection;

db.once('open', async () => {
    console.log(
        chalk.green('连接数据库成功，开始升级')
    );
    console.log(
        chalk.green('开始删除战斗记录数据')
    );
    mongoose.connection.db.dropCollection('battlelogs', function (err, result) {
        console.log(
            chalk.green('战斗记录已删除！')
        );
        console.log(
            chalk.green('开始删除最新动态！')
        );
        mongoose.connection.db.dropCollection('logs', function (err, result) {
            console.log(
                chalk.green('最新动态已删除！')
            );
            console.log(
                chalk.green('升级完毕！')
            );
            process.exit(0);
        });
    });
})

db.on('error', function (error) {
    console.error(
        chalk.red('Error in MongoDb connection: ' + error)
    );
    mongoose.disconnect();
});

db.on('close', function () {
    console.log(
        chalk.red('数据库断开，重新连接数据库')
    );
    mongoose.connect(global.myAppConfig.url, { server: { auto_reconnect: true } });
});
