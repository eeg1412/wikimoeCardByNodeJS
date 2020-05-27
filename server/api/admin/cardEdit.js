const chalk = require('chalk');
const utils = require('../../utils/utils');
const cardData = require('../../utils/database/cardData');
const adminUtils = require('../../utils/admin/adminUtils');
const marketData = require('../../utils/database/market');
const wantCardData = require('../../utils/database/wantCard');
const base64Img = require('base64-img');
const validator = require('validator');
const cardPackageData = require('../../utils/database/cardPackage');

module.exports = async function (req, res, next) {
    const IP = utils.getUserIp(req);
    const token = req.body.token;
    const editPic = req.body.editPic;
    const star = req.body.star;
    const leftType = req.body.leftType;
    const rightType = req.body.rightType;
    const cry = req.body.cry;
    const title = req.body.title;
    const name = req.body.name;
    const imgBase64 = req.body.imgBase64;
    const auther = req.body.auther;
    const md5 = req.body.md5;
    const id_ = req.body.id;
    const packageId = req.body.packageId;

    console.info(
        chalk.green('开始编辑卡牌,IP为：' + IP)
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
    // 校验字段
    let starReg = /^[1-6]{1}$/
    let ltReg = /^[1-5]{1}$/
    let rtReg = /^[1-7]{1}$/
    let cryReg = /^[1-5]{1}$/
    if (!starReg.test(star + '') || !ltReg.test(leftType + '') || !rtReg.test(rightType + '') || !cryReg.test(cry + '') || !title || !name || !auther || !md5 || !utils.objectIDCheck(id_)) {
        console.info(
            chalk.yellow(IP + '卡牌数据参数有误！')
        )
        res.send({
            code: 0,
            msg: '参数有误！'
        });
        return false;
    }
    if (!validator.isMongoId(packageId + '')) {
        res.send({
            code: 0,
            msg: '无该卡包！'
        });
        console.info(
            chalk.yellow('不存在卡包' + packageId + ',IP为：' + IP)
        )
        return false;
    }
    let packageParams = {
        _id: packageId
    }
    let packageResault = await cardPackageData.findCardPackageOne(packageParams).catch((err) => {
        res.send({
            code: 0,
            msg: '内部错误或者卡包ID有误！'
        });
        console.error(
            chalk.red(err)
        );
        return false;
    });
    if (!packageResault) {
        res.send({
            code: 0,
            msg: '无该卡包！'
        });
        return false;
    }
    // 检查是否存在该卡
    const cardMongoData = await cardData.findCardDataOne({ _id: id_ }).catch((err) => {
        throw err;
    });
    if (!cardMongoData) {
        console.info(
            chalk.yellow(IP + '卡牌ID有误！')
        )
        res.send({
            code: 0,
            msg: '卡牌ID有误!'
        });
        return false;
    }
    // 准备各种数据
    let cardParams = {};
    let wantDataParmas = {};
    let marketDataParmas = {};
    if (editPic) {
        cardParams = {
            star: star,
            leftType: leftType,
            rightType: rightType,
            cry: cry,
            title: title,
            name: name,
            auther: auther,
            md5: md5,
            packageId: packageId
        }
        wantDataParmas = {
            star: star,
            title: title,
            name: name,
        }
        marketDataParmas = {
            star: star,
            title: title,
            name: name,
        }
    } else {
        cardParams = {
            title: title,
            name: name,
            auther: auther,
            md5: md5,
            packageId: packageId
        }
        wantDataParmas = {
            title: title,
            name: name,
        }
        marketDataParmas = {
            title: title,
            name: name,
        }
    }

    // 写入卡牌数据库
    await cardData.updataCardData({ _id: id_ }, cardParams).catch((err) => {
        res.send({
            code: 0,
            msg: '内部错误请联系管理员！'
        });
        console.error(
            chalk.red(err)
        );
        return false;
    });
    console.info(
        chalk.green('写入卡牌数据成功,IP为：' + IP)
    );

    // 如果更改了立绘
    if (editPic) {
        let jpgReg = new RegExp("data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/");
        let isJpg = jpgReg.test(imgBase64 + '');
        if (!isJpg || !imgBase64) {
            res.send({
                code: 0,
                msg: '图片上传失败！'
            });
            console.error(
                chalk.yellow('修改立绘数据有误')
            );
            return false
        }
        base64Img.img(imgBase64, ('./public/card/cardIMG/'), (cardMongoData._id), (err, filepath) => {
            if (err) {
                res.send({
                    code: 0,
                    msg: '图片上传失败！'
                });
                console.error(
                    chalk.red('修改卡牌写入失败')
                );
                throw err;
            } else {
                console.log(filepath);
                res.send({
                    code: 1,
                    msg: '卡牌修改并更改立绘成功！'
                });
            }
        });
    } else {
        res.send({
            code: 1,
            msg: '卡牌修改成功！'
        });
    }
    let logObj = {
        text: '使用管理员账号' + adminAccount + '修改了卡牌,卡牌ID为：' + cardMongoData._id,
        ip: IP
    }
    adminUtils.adminWriteLog(logObj);
}