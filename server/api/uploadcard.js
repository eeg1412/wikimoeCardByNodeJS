const utils = require('../utils/utils');
const userCreatCard = require('../utils/database/userCreatCard');
const chalk = require('chalk');
const base64Img = require('base64-img');
const cardPackageData = require('../utils/database/cardPackage');

module.exports = async function (req, res, next) {
    let IP = utils.getUserIp(req);
    let token = req.body.token;
    let star = req.body.star;
    let leftType = req.body.leftType;
    let rightType = req.body.rightType;
    let cry = req.body.cry;
    let title = req.body.title;
    let name = req.body.name;
    let imgBase64 = req.body.imgBase64;
    let SK = req.body.secretkey;
    let captcha = req.body.captcha;
    let packageId = req.body.packageId;

    console.info(
        chalk.green(IP + '开始制卡')
    )
    // 判断验证码
    let adminSK_ = false;
    if (SK) {
        adminSK_ = await utils.adminSK(SK);
    }
    if (!adminSK_) {
        if (req.session.captcha != captcha || !captcha) {
            await req.session.destroy((err) => {
                if (err) {
                    console.info(
                        chalk.red(IP + '验证码清理失败' + '，' + err)
                    );
                }
            })
            res.send({
                code: 0,
                msg: '验证码有误，或者已经过期！'
            });
            console.info(
                chalk.yellow('图形验证码有误。IP为：' + IP)
            );
            return false;
        }
        await req.session.destroy((err) => {
            if (err) {
                console.info(
                    chalk.red(IP + '验证码清理失败' + '，' + err)
                );
            }
        })
    }
    //先解析token
    if (!token) {
        console.info(
            chalk.yellow(IP + '参数有误！')
        )
        res.send({
            code: 403,
            msg: 'token为空！'
        });
        return false;
    }
    // 参数检查
    let starReg = /^[1-6]{1}$/
    let ltReg = /^[1-5]{1}$/
    let rtReg = /^[1-7]{1}$/
    let cryReg = /^[1-5]{1}$/
    let packageIdReg = /^[0-9]*$/
    if (!packageIdReg.test(packageId) || !starReg.test(star) || !ltReg.test(leftType) || !rtReg.test(rightType) || !cryReg.test(cry) || !title || !name || !imgBase64) {
        console.info(
            chalk.yellow(IP + '参数有误！')
        )
        res.send({
            code: 0,
            msg: '参数有误！'
        });
        return false;
    }
    let jpgReg = new RegExp("data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/");
    let isJpg = jpgReg.test(imgBase64);
    if (!isJpg) {
        res.send({
            code: 0,
            msg: '图片上传失败！'
        });
        console.error(
            chalk.yellow('制卡图片数据有误')
        );
        return false
    }
    let result = await utils.tokenCheckAndEmail(token).catch((err) => {
        throw err;
    });
    if (!result) {
        res.send({
            code: 403,
            msg: '账户信息已失效，请重新登录！'
        });
        console.info(
            chalk.yellow('查询结果无该用户,IP为：' + IP)
        );
        return false;
    }
    //卡牌收集大于50
    if (result.cardIndexCount <= 25) {
        res.send({
            code: 0,
            msg: '只有收集25种卡牌以上才能申请添加卡牌！'
        });
        console.error(
            chalk.yellow(email + '卡牌收集率不够还不能上传卡牌')
        );
        return false
    }
    let email = result.email;
    console.info(
        chalk.green(IP + '的邮箱解析结果为' + email)
    )
    // 检查用户已经上传多少张卡牌
    let params = {
        email: email,
        check: 0
    }
    let uploadData = await userCreatCard.findUserCreatCardMany(params).catch((err) => {
        res.send({
            code: 0,
            msg: '内部错误请联系管理员！'
        });
        console.error(
            chalk.red('数据库错误！')
        );
        throw err;
    })
    //检查是否超过20张卡牌
    if (uploadData.length >= global.myAppConfig.creatCardWait) {
        res.send({
            code: 0,
            msg: '待审核的卡牌过多，等管理员审核一些卡牌后再来上传吧！'
        });
        console.error(
            chalk.yellow('制卡数量过多')
        );
        return false
    }
    // 检查是否有这个卡包
    let packageData = await cardPackageData.findCardPackageOne({ packageId: packageId, submitOpen: true }).catch((err) => {
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
            msg: '该卡包暂未开放制卡，请刷新页面重新获取卡包数据！'
        });
        console.info(
            chalk.yellow('不存在卡包' + packageId + ',IP为：' + IP)
        )
        return false;
    }
    //写入数据库
    let timeNow = Math.round(new Date().getTime() / 1000);
    let uploadCardDataParams = {
        email: email,
        md5: result.md5,
        nickName: result.nickName,
        star: Number(star),
        leftType: Number(leftType),
        rightType: Number(rightType),
        cry: Number(cry),
        title: title,
        name: name,
        time: timeNow,
        packageId: packageId,
    }
    let uploadCardData = await userCreatCard.saveUserCreatCard(uploadCardDataParams).catch((err) => {
        res.send({
            code: 0,
            msg: '内部错误请联系管理员！'
        });
        console.error(
            chalk.red('数据库错误！')
        );
        throw err;
    });
    base64Img.img(imgBase64, './public/userCreatCard/', uploadCardData._id, function (err, filepath) {
        if (err) {
            res.send({
                code: 0,
                msg: '图片上传失败！'
            });
            console.error(
                chalk.red('制卡图片写入失败')
            );
            throw err;
        } else {
            console.log(filepath);
            res.send({
                code: 1,
                msg: '卡牌上传成功，请等待审核通过！'
            });
        }
    });
}