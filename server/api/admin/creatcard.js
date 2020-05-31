var chalk = require('chalk');
var utils = require('../../utils/utils');
var userCreatCardData = require('../../utils/database/userCreatCard');
var cardPackageData = require('../../utils/database/cardPackage');
var cardData = require('../../utils/database/cardData');
var userData = require('../../utils/database/user');
var adminUtils = require('../../utils/admin/adminUtils');
var fs = require('fs');

module.exports = async function (req, res, next) {
    let IP = utils.getUserIp(req);
    let token = req.body.token;
    let type = req.body.type;
    console.info(
        chalk.green('开始审核卡牌,IP为：' + IP)
    )
    if (!token) {
        res.send({
            code: 402,
            msg: '验证已失效'
        });
        console.info(
            chalk.yellow('token为空,IP为：' + IP)
        )
        return false;
    }
    let resultAdmin = await adminUtils.checkAdmin(token, IP);
    if (!resultAdmin) {
        res.send({
            code: 402,
            msg: '账户信息已失效，请重新登录！'
        });
        console.info(
            chalk.yellow('token解析失败,IP为：' + IP)
        )
        return false;
    }

    let adminAccount = resultAdmin.account;
    if (type === 'get') {
        let page = req.body.page;
        let UCCData = await userCreatCardData.findUserCreatCard(20, page, {}, { 'check': 1, 'time': -1 }).catch((err) => {
            res.send({
                code: 0,
                msg: '内部错误请联系管理员！'
            });
            console.error(
                chalk.red('数据库查询错误！')
            );
            throw err;
        });
        res.send({
            code: 1,
            total: UCCData[1],
            data: UCCData[0],
            msg: 'ok'
        });
    } else if (type === 'check') {
        let pass = req.body.pass ? 1 : 0;
        let id = req.body.id;
        let mark = req.body.mark ? req.body.mark : '无';
        let packageId = req.body.packageId;
        let UCCData = await userCreatCardData.findUserCreatCardOne({ _id: id }).catch((err) => {
            res.send({
                code: 0,
                msg: '内部错误请联系管理员！'
            });
            console.error(
                chalk.red('数据库查询错误！')
            );
            throw err;
        });
        if (!UCCData) {
            res.send({
                code: 0,
                msg: '无该卡牌！'
            });
            console.info(
                chalk.yellow('卡牌审核ID有误！,IP为：' + IP)
            )
            return false;
        }
        if (UCCData.check == 1) {
            res.send({
                code: 0,
                msg: '卡牌已审核'
            });
            console.info(
                chalk.yellow('卡牌审核状态有误！,IP为：' + IP)
            )
            return false;
        }
        let newCardId = null;
        if (pass) {
            // 检查有没有这个卡包
            if (!packageId && packageId !== 0) {
                res.send({
                    code: 0,
                    msg: '无该卡包！'
                });
                console.info(
                    chalk.yellow('不存在卡包' + packageId + ',IP为：' + IP)
                )
                return false;
            }
            let packageData = await cardPackageData.findCardPackageOne({ packageId: packageId }).catch((err) => {
                res.send({
                    code: 0,
                    msg: '内部错误请联系管理员！'
                });
                console.error(
                    chalk.red(err)
                );
                return false;
            });
            if (!packageData) {
                res.send({
                    code: 0,
                    msg: '无该卡包！'
                });
                console.info(
                    chalk.yellow('不存在卡包' + packageId + ',IP为：' + IP)
                )
                return false;
            }
            // 生成卡牌ID
            newCardId = await cardData.findCardCount({}).catch((err) => {
                res.send({
                    code: 0,
                    msg: '内部错误请联系管理员！'
                });
                console.error(
                    chalk.red(err)
                );
                return false;
            });
            newCardId = newCardId + 5000 + utils.randomNumberZero(6);
            // 文件转移
            fs.renameSync('./public/userCreatCard/' + UCCData._id + '.jpg', './public/card/' + packageId + '/' + newCardId + '.jpg')
            // 写入卡牌数据库
            let cardParams = {
                cardId: newCardId,
                star: UCCData.star,
                leftType: UCCData.leftType,
                rightType: UCCData.rightType,
                cry: UCCData.cry,
                title: UCCData.title,
                name: UCCData.name,
                packageId: packageId,
                auther: UCCData.nickName,
                md5: UCCData.md5
            }
            await cardData.saveCardData(cardParams).catch((err) => {
                res.send({
                    code: 0,
                    msg: '内部错误请联系管理员！'
                });
                console.error(
                    chalk.red(err)
                );
                return false;
            });
            //增加卡包数量
            let starAdd = {}
            switch (UCCData.star) {
                case 1:
                    starAdd = { $inc: { oneStar: 1 } };
                    break;
                case 2:
                    starAdd = { $inc: { twoStar: 1 } };
                    break;
                case 3:
                    starAdd = { $inc: { threeStar: 1 } };
                    break;
                case 4:
                    starAdd = { $inc: { fourStar: 1 } };
                    break;
                case 5:
                    starAdd = { $inc: { fiveStar: 1 } };
                    break;
                case 6:
                    starAdd = { $inc: { sixStar: 1 } };
                    break;
            }
            await cardPackageData.updataCardPackage({ packageId: packageId }, starAdd).catch((err) => {
                res.send({
                    code: 0,
                    msg: '内部错误请联系管理员！'
                });
                console.error(
                    chalk.red(err)
                );
                return false;
            });
            //设定给与星星卡牌计数+1
            let userParams = {
                email: UCCData.email
            }
            let updateParams = {
                $inc: {
                    star: global.myAppConfig.creatCardStar,
                    UCC: 1
                }
            };
            await userData.updataUser(userParams, updateParams).catch((err) => {
                res.send({
                    code: 0,
                    msg: '内部错误，更新失败！'
                });
                console.error(
                    chalk.red('数据库更新错误！')
                );
                throw err;
            })
            let logObj = {
                text: '使用管理员账号' + adminAccount + '审核了卡牌,卡包为：' + packageId + '卡牌为：' + newCardId,
                ip: IP
            }
            adminUtils.adminWriteLog(logObj);
            if (UCCData.nickName) {//兼容老数据
                let timeNow = Math.round(new Date().getTime() / 1000);
                let IndexObj = {
                    email: UCCData.email,
                    md5: UCCData.md5,
                    nickName: UCCData.nickName,
                    type: 'UCC',
                    time: timeNow,
                    data: {
                        packageId: packageId,
                        name: UCCData.name,
                        title: UCCData.title,
                        star: UCCData.star,
                        cardId: newCardId
                    },
                    ip: IP
                }
                utils.writeLog(IndexObj);
            }
        } else {
            fs.unlinkSync('./public/userCreatCard/' + UCCData._id + '.jpg');
        }
        //写入用户卡牌申请
        await userCreatCardData.updataUserCreatCard({ _id: id }, { check: 1, pass: pass, packageId: pass ? packageId : '', cardId: pass ? newCardId : '', mark: mark }).catch((err) => {
            res.send({
                code: 0,
                msg: '内部错误请联系管理员！'
            });
            console.error(
                chalk.red('数据库查询错误！')
            );
            throw err;
        });
        res.send({
            code: 1,
            msg: '审核成功！'
        });
        console.info(
            chalk.green(adminAccount + '审核了卡牌,IP为：' + IP)
        )
    } else {
        res.send({
            code: 0,
            msg: '参数有误！'
        });
        let logObj = {
            text: '使用管理员账号' + adminAccount + '使用了不正确的新闻参数！',
            ip: IP
        }
        adminUtils.adminWriteLog(logObj);
        console.info(
            chalk.green(adminAccount + '参数有误,IP为：' + IP)
        )
    }
}