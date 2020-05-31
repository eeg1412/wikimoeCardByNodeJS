var utils = require('../../../utils/utils');
var adminUtils = require('../../../utils/admin/adminUtils');
var adminUtilsDatabase = require('../../../utils/database/adminAccount');
var cardPackageDatabase = require('../../../utils/database/cardPackage');
var cardDataDatabase = require('../../../utils/database/cardData');
var cardData = require('../../../data/cardData.json');
var chalk = require('chalk');
var validator = require('validator');
var md5 = require('md5-node');

module.exports = async function (req, res, next) {
    let IP = utils.getUserIp(req);
    console.info(
        chalk.yellow(IP + '请求安装')
    );
    if (global.myAppConfig.init) {
        res.send({
            code: 403,
            msg: '项目已安装！'
        });
        let logObj = {
            text: '试图安装抽卡，但是已经安装过了。',
            ip: IP
        }
        adminUtils.adminWriteLog(logObj);
        console.info(
            chalk.yellow(IP + '结果为已安装')
        );
    } else {
        if (req.body.config) {
            let config_ = req.body.config;
            // 校验数据
            try {
                if (validator.isEmpty(config_.account, { ignore_whitespace: false })) {
                    res.send({
                        code: 0,
                        msg: '管理员账号不能为空！'
                    });
                    console.info(
                        chalk.yellow(IP + '管理员账号不能为空！')
                    );
                    return false;
                }
                if (validator.isEmpty(config_.password, { ignore_whitespace: false })) {
                    res.send({
                        code: 0,
                        msg: '管理员密码不能为空！'
                    });
                    console.info(
                        chalk.yellow(IP + '管理员密码不能为空！')
                    );
                    return false;
                }

                if (validator.isEmpty(config_.sessionSecret, { ignore_whitespace: false })) {
                    res.send({
                        code: 0,
                        msg: 'session加密字符串不能为空！'
                    });
                    console.info(
                        chalk.yellow(IP + 'session加密字符串不能为空！')
                    );
                    return false;
                }
                if (validator.isEmpty(config_.JWTSecret, { ignore_whitespace: false })) {
                    res.send({
                        code: 0,
                        msg: 'JWT加密字符串不能为空！'
                    });
                    console.info(
                        chalk.yellow(IP + 'JWT加密字符串不能为空！')
                    );
                    return false;
                }
                if (!validator.isInt(config_.dailyChance.toString(), { min: 1 })) {
                    res.send({
                        code: 0,
                        msg: '每日抽卡次数必须是大于1的数字'
                    });
                    console.info(
                        chalk.yellow(IP + '每日抽卡次数必须是大于1的数字')
                    );
                    return false;
                }
                if (validator.isEmpty(config_.smtpHost, { ignore_whitespace: false })) {
                    res.send({
                        code: 0,
                        msg: '邮件发送host不能为空！'
                    });
                    console.info(
                        chalk.yellow(IP + '邮件发送host不能为空！')
                    );
                    return false;
                }
                if (!validator.isInt(config_.smtpPort.toString(), { min: 1 })) {
                    res.send({
                        code: 0,
                        msg: '邮件发送端口必须是大于1的数字'
                    });
                    console.info(
                        chalk.yellow(IP + '邮件发送端口必须是大于1的数字')
                    );
                    return false;
                }
                if (validator.isEmpty(config_.smtpAuthUser, { ignore_whitespace: false })) {
                    res.send({
                        code: 0,
                        msg: '邮件用户名不能为空！'
                    });
                    console.info(
                        chalk.yellow(IP + '邮件用户名不能为空！')
                    );
                    return false;
                }
                if (validator.isEmpty(config_.smtpAuthPass, { ignore_whitespace: false })) {
                    res.send({
                        code: 0,
                        msg: '邮件密码不能为空！'
                    });
                    console.info(
                        chalk.yellow(IP + '邮件密码不能为空！')
                    );
                    return false;
                }
                if (!validator.isInt(config_.robotCheckStar.toString(), { min: 1 })) {
                    res.send({
                        code: 0,
                        msg: '机器人验证通过后送的星星必须是大于1的数字'
                    });
                    console.info(
                        chalk.yellow(IP + '机器人验证通过后送的星星必须是大于1的数字')
                    );
                    return false;
                }
                if (!validator.isInt(config_.robotCheckCanGetStar.toString(), { min: 1 })) {
                    res.send({
                        code: 0,
                        msg: '机器人可疑度低于这个值送星星必须是大于1的数字'
                    });
                    console.info(
                        chalk.yellow(IP + '机器人可疑度低于这个值送星星必须是大于1的数字')
                    );
                    return false;
                }
                if (!validator.isInt(config_.deminingStarRatio.toString(), { min: 1 })) {
                    res.send({
                        code: 0,
                        msg: '挖矿获得星星的倍率必须是大于1的数字'
                    });
                    console.info(
                        chalk.yellow(IP + '挖矿获得星星的倍率必须是大于1的数字')
                    );
                    return false;
                }
                if (!validator.isInt(config_.deminingItemRatio.toString(), { min: 1 })) {
                    res.send({
                        code: 0,
                        msg: '挖矿获得宝石的倍率必须是大于1的数字'
                    });
                    console.info(
                        chalk.yellow(IP + '挖矿获得宝石的倍率必须是大于1的数字')
                    );
                    return false;
                }
                if (!validator.isInt(config_.creatCardStar.toString(), { min: 1 })) {
                    res.send({
                        code: 0,
                        msg: '制卡审核通过后获得的星星必须是大于1的数字'
                    });
                    console.info(
                        chalk.yellow(IP + '制卡审核通过后获得的星星必须是大于1的数字')
                    );
                    return false;
                }
                if (!validator.isInt(config_.creatCardWait.toString(), { min: 1 })) {
                    res.send({
                        code: 0,
                        msg: '单用户最多等待审核的制卡必须是大于1的数字'
                    });
                    console.info(
                        chalk.yellow(IP + '单用户最多等待审核的制卡必须是大于1的数字')
                    );
                    return false;
                }
                if (!validator.isInt(config_.useMarketCardCount.toString(), { min: 1 })) {
                    res.send({
                        code: 0,
                        msg: '集齐多少种卡牌后能在市场交易必须是大于1的数字'
                    });
                    console.info(
                        chalk.yellow(IP + '集齐多少种卡牌后能在市场交易必须是大于1的数字')
                    );
                    return false;
                }
                if (!validator.isInt(config_.battleRankGetItem.toString(), { min: 1 })) {
                    res.send({
                        code: 0,
                        msg: '竞技第一名额外获得结缘币的数量必须是大于1的数字'
                    });
                    console.info(
                        chalk.yellow(IP + '竞技第一名额外获得结缘币的数量必须是大于1的数字')
                    );
                    return false;
                }
                if (!validator.isInt(config_.battleRankGetItemDecay.toString(), { min: 1 })) {
                    res.send({
                        code: 0,
                        msg: '后面陆续获得结缘币的衰减数量必须是大于1的数字'
                    });
                    console.info(
                        chalk.yellow(IP + '后面陆续获得结缘币的衰减数量必须是大于1的数字')
                    );
                    return false;
                }
            }
            catch (error) {
                res.send({
                    code: 0,
                    msg: '参数有误！'
                });
                console.info(
                    chalk.yellow('设置参数有误', error)
                );
                return false;
            }
            let searchAdmin = await adminUtilsDatabase.findAdmin({}).catch((err) => {
                res.send({
                    code: 0,
                    msg: '内部错误请联系管理员！'
                });
                console.error(
                    chalk.red('数据库更新错误！')
                );
                throw err;
            });
            if (searchAdmin) {
                res.send({
                    code: 0,
                    msg: '检测到已经有管理员账号，请检查配置！'
                });
                console.error(
                    chalk.red('已经存在管理员账号，安装失败！')
                );
                return false;
            }
            // 配置信息
            let adminParams = {
                account: config_.account,
                password: md5(config_.password),
                ip: IP,
            };
            let opt = {
                init: 'true',
                sessionSecret: config_.sessionSecret,//session加密字符串
                JWTSecret: config_.JWTSecret,//JWT加密字符串
                dailyChance: Number(config_.dailyChance),//每日抽卡次数
                smtpHost: config_.smtpHost,//邮件发送host
                smtpPort: Number(config_.smtpPort),//邮件发送端口
                smtpAuth: {
                    user: config_.smtpAuthUser,//用户名
                    pass: config_.smtpAuthPass//密码
                },
                robotCheckStar: Number(config_.robotCheckStar),//机器人验证通过后送的星星
                robotCheckCanGetStar: Number(config_.robotCheckCanGetStar),//机器人可疑度低于这个值送星星
                deminingStarRatio: Number(config_.deminingStarRatio),//挖矿获得星星的倍率
                deminingItemRatio: Number(config_.deminingItemRatio),//挖矿获得宝石的倍率
                creatCardStar: Number(config_.creatCardStar),//制卡审核通过后获得的星星
                creatCardWait: Number(config_.creatCardWait),//单用户最多等待审核的制卡
                useMarketCardCount: Number(config_.useMarketCardCount),//集齐多少种卡牌后能在市场卖卡
                battleRankGetItem: Number(config_.battleRankGetItem),//竞技第一名额外获得结缘币的数量
                battleRankGetItemDecay: Number(config_.battleRankGetItemDecay),//后面陆续获得结缘币的衰减数量
                donateImgUrl: config_.donateImgUrl || '',//捐赠图片URL地址
                creatCardExplainUrl: config_.creatCardExplainUrl || '',//制卡说明图片URL地址
                QQunURL: config_.QQunURL || '',//加群链接
                courseURL: config_.courseURL || '',//教程链接
                browserTitle: config_.browserTitle || '维基萌抽卡',//浏览器标签标题
                siteTitle: config_.siteTitle || '维基萌抽卡',//网站标题
            };
            adminUtilsDatabase.saveAdminAccount(adminParams);
            adminUtils.writeGlobalOpt(opt);
            // 创建初始卡牌
            // 获取卡牌数据
            let cardData_ = cardData['cardData']
            let one = 0;
            let two = 0;
            let three = 0;
            let four = 0;
            let five = 0;
            let six = 0;
            for (var index in cardData_) {
                let thisCard = cardData_[index]
                let cardDataParams = {
                    cardId: Number(index),
                    star: thisCard.star,
                    leftType: thisCard.leftType,
                    rightType: thisCard.rightType,
                    cry: thisCard.cry,
                    title: thisCard.title,
                    name: thisCard.name,
                    packageId: '0',
                    auther: '广树',
                    md5: 'fbb31d99a24cf9a56c48b44dd0797d22'
                }
                if (thisCard.star == 1) {
                    one++
                } else if (thisCard.star == 2) {
                    two++
                } else if (thisCard.star == 3) {
                    three++
                } else if (thisCard.star == 4) {
                    four++
                } else if (thisCard.star == 5) {
                    five++
                } else if (thisCard.star == 6) {
                    six++
                }
                await cardDataDatabase.saveCardData(cardDataParams).catch((err) => {
                    res.send({
                        code: 0,
                        msg: '内部错误请联系管理员！'
                    });
                    console.error(
                        chalk.red('数据库更新错误！')
                    );
                    throw err;
                })
                console.info(
                    chalk.green('写入卡牌：' + index + '成功！')
                );
            }
            // 创建初始卡包
            let packageParams = {
                name: '维基萌卡包',
                packageId: '0',
                open: true,
                guessOpen: true,
                starCoinOpen: true,
                starShopOpen: true,
                submitOpen: true,
                oneStar: one,
                twoStar: two,
                threeStar: three,
                fourStar: four,
                fiveStar: five,
                sixStar: six,
            }
            await cardPackageDatabase.saveCardPackage(packageParams).catch((err) => {
                res.send({
                    code: 0,
                    msg: '内部错误请联系管理员！'
                });
                console.error(
                    chalk.red('数据库更新错误！')
                );
                throw err;
            })
            res.send({
                code: 1,
                msg: '安装成功'
            });
            console.info(
                chalk.green(IP + '安装成功')
            );
        } else {
            res.send({
                code: 0,
                msg: '参数有误！'
            });
            console.info(
                chalk.yellow(IP + '没有参数')
            );
        }
    }
}