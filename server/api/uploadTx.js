const utils = require('../utils/utils');
const chalk = require('chalk');
const base64Img = require('base64-img');

module.exports = async function (req, res, next) {
    let IP = utils.getUserIp(req);
    let token = req.body.token;
    let imgBase64 = req.body.imgBase64;

    console.info(
        chalk.green(IP + '开始上传头像')
    )

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

    let jpgReg = new RegExp("data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/");
    let isJpg = jpgReg.test(imgBase64);
    if (imgBase64.length > 11000) {
        res.send({
            code: 0,
            msg: '图像体积过大，头像上传失败！'
        });
        console.info(
            chalk.yellow('头像体积过大，体积为' + imgBase64.length + ',IP为：' + IP)
        );
        return false
    }
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
    let email = result.email;
    console.info(
        chalk.green(IP + '的邮箱解析结果为' + email)
    )

    base64Img.img(imgBase64, './public/userTx/', result.md5, function (err, filepath) {
        if (err) {
            res.send({
                code: 0,
                msg: '头像上传失败！'
            });
            console.error(
                chalk.red('头像写入失败')
            );
            throw err;
        } else {
            console.log(filepath);
            res.send({
                code: 1,
                msg: '头像上传成功！如果遇到头像没有刷新，可能是因为缓存，请等待一段时间后再刷新页面！'
            });
        }
    });
}