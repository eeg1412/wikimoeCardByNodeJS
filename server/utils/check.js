const guessCard = require('../utils/database/guessCard');
const userGuessCard = require('../utils/database/userGuessCard');
const userData = require('../utils/database/user');
const fs = require('fs');
const chalk = require('chalk');
const schedule = require('node-schedule');
const cardPackageData = require('../utils/database/cardPackage');
const userbattleinfoData = require('../utils/database/userbattleinfo');
const itemDatabase = require('../utils/database/item');
const userPost = require('../utils/database/userPost');
const ais = require('../utils/database/ais');

// 月结算竞技点日程表
exports.checkScoreRankTimer = async () => {
    schedule.scheduleJob('0 5 3 1 * *', () => {//每月1日3点5分执行
        this.checkScoreRank();
    });
    // schedule.scheduleJob('00 27 * * * *',()=>{//每月1日3点5分执行
    //     this.checkScoreRank();
    // }); 
}
// 每个月结算竞技点
exports.checkScoreRank = async () => {
    // 循环全员数据
    console.info(
        chalk.yellow('开始结算竞技点，竞技将被锁定！')
    );
    const maxScore = 10000 //最大竞技点
    global.checkScoreRankIng = true;
    setTimeout(() => {
        global.checkScoreRankIng = false;
        console.info(
            chalk.yellow('竞技锁定结束！')
        );
    }, 600000)
    // 删除AI数据
    console.info(
        chalk.green('删除AI数据！')
    );
    ais.deletAisMany({}).catch((err) => {
        console.error(
            chalk.red('数据库更新错误！')
        );
        throw err;
    });
    let coinAdd = global.myAppConfig.battleRankGetItem;
    const coinRankDecay = global.myAppConfig.battleRankGetItemDecay;
    //let preScore = -1;
    let rank = 1;
    userData.findUserMany({}, '-__v', { score: -1, cardIndexCount: -1 }).then(users => users.forEach(async (item, index) => {
        // 计算给与多少结缘币
        const score = item.score;//用户竞技点
        const getCoin = Math.floor(score / 500);//每500竞技点1个结缘币
        let newScore = Math.floor(score / 250) * 250;//新的竞技点
        if (newScore > maxScore) {
            newScore = maxScore;
        }
        // 用户
        const params = {
            email: item.email
        }
        // 写入道具到邮件
        if (getCoin > 0 && item.battled && item.ban === 0) {
            const time = Math.round(new Date().getTime() / 1000);
            const canGetItem = getCoin + (coinAdd < 0 ? 0 : coinAdd);
            const saveParams = {
                text: '恭喜，您在本次的竞技中取得了' + score + '点竞技点，排名第' + rank + '名。共获得' + canGetItem + '个【结缘币】，请注意查收！',
                title: '竞技点结算奖励',
                time: time,
                endTime: time + 2592000,
                type: 'item',
                itemId: '300',
                itemNumber: canGetItem,
                email: item.email
            };
            userPost.saveUserPost(saveParams).catch((err) => {
                console.error(
                    chalk.red('数据库更新错误！')
                );
                throw err;
            })
            coinAdd = coinAdd - coinRankDecay;
            rank++;
        }
        // 查询对战记录
        let battleWinLose = {
            win: 0,
            lose: 0,
            draw: 0
        }
        const battleWLDData = await userbattleinfoData.findOne(params).catch((err) => {
            console.error(
                chalk.red('数据库更新错误！')
            );
            throw err;
        });
        if (battleWLDData) {
            battleWinLose = {
                win: battleWLDData.win,
                lose: battleWLDData.lose,
                draw: battleWLDData.draw
            }
        }
        // 写入历史
        const timeNow = Math.floor(new Date().getTime() / 86400000);
        let update_ = {
            win: 0,
            lose: 0,
            draw: 0,
            $push: {
                battleScoreHistory: {
                    time: timeNow,
                    win: battleWinLose.win,
                    lose: battleWinLose.lose,
                    draw: battleWinLose.draw,
                    score: score
                }
            }
        }
        userbattleinfoData.findOneAndUpdate(params, update_).catch((err) => {
            console.error(
                chalk.red('数据库更新错误！')
            );
            throw err;
        })
        // 写入用户数据
        userData.updataUser(params, { score: newScore, battled: false }).catch((err) => {
            console.error(
                chalk.red('数据库更新错误！')
            );
            throw err;
        });
    }))
}
// 1.3.x升级卡包数据
exports.checkPackage = async () => {
    console.info(
        chalk.yellow('开始对卡包数据进行升级！')
    );
    const params = {
        guessOpen: true,
        starCoinOpen: true,
        starShopOpen: true,
    }
    await cardPackageData.updataCardPackageMany({}, params).catch((err) => {
        console.error(
            chalk.red(err)
        );
        return false;
    });
    console.info(
        chalk.yellow('卡包数据升级完毕！')
    );
}

exports.checkGuessCard = async () => {
    // 查看现在有没有开放的猜卡
    const guessCardData = await guessCard.findGuessCardOne({ open: true }).catch((err) => {
        console.error(
            chalk.red(err)
        );
        return false;
    });
    const timeNow = Math.floor(new Date().getTime() / 3600000);
    const dataTime = guessCardData ? guessCardData.time : 0;
    if (!guessCardData) {
        console.info(
            chalk.yellow('目前不存在猜卡数据，系统将自动生成！')
        );
        guessCard.creatNewGuessCard();
        this.deletOldUserGuessCard();
    } else if (dataTime < timeNow) {
        console.info(
            chalk.yellow('猜卡数据过期，系统将自动生成！')
        );
        guessCard.creatNewGuessCard();
        this.deletOldUserGuessCard();
    }
    schedule.scheduleJob('0 0 * * * *', () => {
        guessCard.creatNewGuessCard();
        this.deletOldUserGuessCard();
    });
}
exports.checkOldPost = () => {
    schedule.scheduleJob('0 0 3 * * *', () => {
        this.deletOldPost();
    });
}
exports.deletOldPost = () => {
    console.info(
        chalk.green('系统自动删除过期用户邮箱礼物！')
    );
    // 删除过期邮件数据
    const time = Math.round(new Date().getTime() / 1000);
    const delParmas = {
        endTime: { $lt: time },
    }
    userPost.deletUserPost(delParmas).catch((err) => {
        throw err;
    });
}
exports.deletOldUserGuessCard = async () => {
    const time = Math.floor(new Date().getTime() / 3600000);
    let delParmas = {
        time: { $lt: time - 720 },
    }
    console.info(
        chalk.green('删除旧的用户猜卡数据!')
    )
    userGuessCard.deleUserGuessCardMany(delParmas).catch((err) => {
        console.error(
            chalk.red('数据库查询错误！')
        );
        throw err;
    });
}
exports.checkRank = async () => {
    let rankData = fs.readFileSync('./config/cache/rank.json', 'utf8');
    rankData = JSON.parse(rankData);
    let DataTime = rankData['time'];
    let timeNow = new Date().getTime();
    if (timeNow - DataTime > 86400000) {
        console.info(
            chalk.yellow('排行榜过旧，系统将自动生成！')
        );
        this.creatRankFile();
    }
    schedule.scheduleJob('0 0 3 * * *', () => {
        this.creatRankFile();
    });
}
// 创建排行榜数据
exports.creatRankFile = async () => {
    let timeNow = new Date().getTime();
    console.info(
        chalk.green('更新排行榜中...')
    )
    let newRankData = {};
    newRankData['time'] = timeNow;
    // 查询掘星
    let parmas = { ban: 0 }; //结算非封禁账号排行榜
    let pageSize_ = 5;
    let page_ = 1;
    let getParams = '-_id deminingStarCount md5 nickName';
    let sortData = { deminingStarCount: -1 };
    let deminingStarCount_ = await userData.findUserInPage(parmas, pageSize_, page_, getParams, sortData);
    newRankData['deminingStarCount'] = deminingStarCount_['data'];
    // 查询竞技点
    getParams = '-_id score md5 nickName';
    sortData = { score: -1 };
    let score_ = await userData.findUserInPage(parmas, pageSize_, page_, getParams, sortData);
    newRankData['score'] = score_['data'];
    // 查询等级
    getParams = '-_id level md5 nickName';
    sortData = { level: -1 };
    let level_ = await userData.findUserInPage(parmas, pageSize_, page_, getParams, sortData);
    newRankData['level'] = level_['data'];
    // 查询收集率
    getParams = '-_id cardIndexCount md5 nickName';
    sortData = { cardIndexCount: -1 };
    let cardIndexCount_ = await userData.findUserInPage(parmas, pageSize_, page_, getParams, sortData);
    newRankData['cardIndexCount'] = cardIndexCount_['data'];
    // 查询制卡数量
    getParams = '-_id UCC md5 nickName';
    sortData = { UCC: -1 };
    let UCC_ = await userData.findUserInPage(parmas, pageSize_, page_, getParams, sortData);
    newRankData['UCC'] = UCC_['data'];
    // 查询星星数量
    getParams = '-_id star md5 nickName';
    sortData = { star: -1 };
    let star_ = await userData.findUserInPage(parmas, pageSize_, page_, getParams, sortData);
    newRankData['star'] = star_['data'];
    // 查询猜卡数量
    getParams = '-_id guessCardCount md5 nickName';
    sortData = { guessCardCount: -1 };
    let guessCardCount_ = await userData.findUserInPage(parmas, pageSize_, page_, getParams, sortData);
    newRankData['guessCardCount'] = guessCardCount_['data'];
    // 查询任务数量
    getParams = '-_id questCount md5 nickName';
    sortData = { questCount: -1 };
    let questCount_ = await userData.findUserInPage(parmas, pageSize_, page_, getParams, sortData);
    newRankData['questCount'] = questCount_['data'];
    // 更新文件
    let rankData_ = JSON.stringify(newRankData);
    fs.writeFileSync('./config/cache/rank.json', rankData_, 'utf8');
    console.info(
        chalk.green('更新排行榜完毕...')
    )
}