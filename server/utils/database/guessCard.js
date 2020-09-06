const guessCardModel = require('../../models/guessCard');
const cardPackageData = require('../database/cardPackage');
const cardData = require('../database/cardData');
const utils = require('../utils');
const chalk = require('chalk');

exports.saveGuessCard = async function (parmas) {
    // document作成
    var guessCard = new guessCardModel(parmas);
    // document保存
    return await guessCard.save()
}
exports.findGuessCardOne = async function (parmas) {
    return await guessCardModel.findOne(parmas);
}
exports.findGuessCardMany = async function (parmas, getInfo = '-__v') {
    return await guessCardModel.find(parmas, getInfo);
}
exports.findGuessCard = async function (pageSize_, page_, parmas, sort, getInfo = '-__v') {
    // document查询
    let pageSize = pageSize_;
    let page = isNaN(Math.round(page_)) ? 1 : Math.round(page_);
    page = Math.abs(page);
    let query = guessCardModel.find(parmas, getInfo).sort(sort);
    let total = await query.countDocuments();
    let data = await query
        .find()
        .skip(pageSize * (page - 1))
        .limit(pageSize);
    return [data, total];
}
exports.updataGuessCard = async function (filters, parmas) {
    // document查询
    return await guessCardModel.updateMany(filters, parmas);
}
exports.updataGuessCardOne = async function (filters, parmas) {
    // document查询
    return await guessCardModel.updateOne(filters, parmas);
}
exports.deletGuessCard = async function (parmas) {
    // document查询
    return await guessCardModel.deleteOne(parmas);
}
exports.deletGuessCardMany = async function (parmas) {
    // document查询
    return await guessCardModel.deleteMany(parmas);
}
// 创建新的猜卡
exports.creatNewGuessCard = async () => {
    console.info(
        chalk.green('生成猜卡数据中...')
    );
    // 查询开放的卡包
    const resaultPackage = await cardPackageData.findCardPackageMany({ guessOpen: true }).catch((err) => {
        console.error(
            chalk.red(err)
        );
        return false;
    });
    if (resaultPackage.length <= 0) {
        console.error(
            chalk.red('未设置猜卡卡包！')
        );
        return false;
    }
    let openPackageId = [];
    for (let i = 0; i < resaultPackage.length; i++) {
        openPackageId.push(resaultPackage[i].packageId)
    }
    // 将所有卡牌数据读入
    const allCardData = await cardData.findCardDataMany({ packageId: { $in: openPackageId } }).catch((err) => {
        console.error(
            chalk.red(err)
        );
        return false;
    });
    // 卡牌星级分类
    const starSix = allCardData.filter(item => item.star === 6);
    const starFive = allCardData.filter(item => item.star === 5);
    const starFour = allCardData.filter(item => item.star === 4);
    const starThree = allCardData.filter(item => item.star <= 3);
    // 判断卡牌够不够
    if (starSix.length < 1) {
        console.error(
            chalk.red('尝试生成猜卡数据，但是6星卡不足！')
        );
        return false;
    } else if (starFive.length < 2) {
        console.error(
            chalk.red('尝试生成猜卡数据，但是5星卡不足！')
        );
        return false;
    } else if (starFour.length < 5) {
        console.error(
            chalk.red('尝试生成猜卡数据，但是4星卡不足！')
        );
        return false;
    } else if (starThree.length < 42) {
        console.error(
            chalk.red('尝试生成猜卡数据，但是3星卡及其以下的卡牌不足！')
        );
        return false;
    }
    // 生成随机星级卡牌数量
    let guessCardArr = utils.randomArray(starSix, 1);
    guessCardArr = guessCardArr.concat(utils.randomArray(starFive, 2));
    guessCardArr = guessCardArr.concat(utils.randomArray(starFour, 5));
    guessCardArr = guessCardArr.concat(utils.randomArray(starThree, 42));
    // 取其中30个
    guessCardArr = utils.randomArray(guessCardArr, 30);
    let guessCardArrRes = [];
    for (let i = 0; i < guessCardArr.length; i++) {
        const data_ = {
            packageId: guessCardArr[i].packageId,
            cardId: guessCardArr[i].cardId
        }
        guessCardArrRes.push(data_);
    }
    // 将现在开放的猜卡关闭并抽选出中奖序号
    await this.creatGuessCardAttack();
    // 设定时间
    const timeNow = Math.floor(new Date().getTime() / 3600000);
    // 写入数据库
    const parmas = {
        card: guessCardArrRes,
        time: timeNow,
        open: true
    }
    await this.saveGuessCard(parmas).catch((err) => {
        console.error(
            chalk.red('数据库查询错误！')
        );
        throw err;
    });
    console.info(
        chalk.green('生成猜卡数据完毕！')
    );
    // 删除旧的猜卡
    this.deleteOldGuessCard();
}
// 删除旧的猜卡
exports.deleteOldGuessCard = async () => {
    const time = Math.floor(new Date().getTime() / 3600000);
    let delParmas = {
        time: { $lt: time - 720 },
    }
    this.deletGuessCardMany(delParmas).catch((err) => {
        console.error(
            chalk.red('数据库查询错误！')
        );
        throw err;
    });
}
// 生成中奖数组
exports.creatGuessCardAttack = async () => {
    const arr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29];
    let attackArr = [];
    attackArr = utils.randomArray(arr, 6);
    await this.updataGuessCard({ open: true }, { open: false, attackIndex: attackArr }).catch((err) => {
        console.error(
            chalk.red('数据库查询错误！')
        );
        throw err;
    })
}
// 记得统计卡牌数量