var usersModel = require('../models/users');
var emailCodeModel = require('../models/emailCode');
var md5 = require('md5-node');
var utils = require('../utils/utils');
var chalk = require('chalk');
var userData = require('../utils/database/user');
module.exports = async function (req, res, next) {
    let IP = utils.getUserIp(req);
    console.info(
        chalk.green(req.body.email + '提交了一次密码修改！IP为：' + IP)
    )
    // 数据验证
    if (req.body.email && req.body.password && req.body.emailCode) {//判断是否有数据
        //验证邮箱
        let email = req.body.email;
        let password = req.body.password;
        let emailCode = req.body.emailCode;
        if (!utils.emailCheck(email)) {
            res.send({
                code: 0,
                msg: '邮箱格式有误！'
            });
            console.info(
                chalk.yellow(req.body.email + '邮箱格式有误！IP为：' + IP)
            )
            return false;
        }
        if (!utils.passwordCheck(password)) {
            res.send({
                code: 0,
                msg: '密码必须为4-16位英数字下划线减号'
            });
            console.info(
                chalk.yellow(req.body.email + '密码格式有误！IP为：' + IP)
            )
            return false;
        }
        let emailCodeData = null;
        emailCodeData = await emailCodeModel.findOne({ email: email }, function (err, result) {
            if (err) {
                throw err;
            } else {
                //判断是否有该邮箱
                if (result) {
                    return result;
                } else {
                    return null;
                }
            }
        });
        if (emailCodeData) {
            let time = Math.round(new Date().getTime() / 1000);
            if (time - emailCodeData.time > 1800) {
                res.send({
                    code: 0,
                    msg: '验证码已过期！'
                });
                console.info(
                    chalk.yellow(req.body.email + '验证码过期！IP为：' + IP)
                )
                return false;
            } else if (emailCodeData.code !== emailCode) {
                res.send({
                    code: 0,
                    msg: '验证码错误！'
                });
                console.info(
                    chalk.yellow(req.body.email + '验证码错误！IP为：' + IP)
                )
                return false;
            }
        } else {
            res.send({
                code: 0,
                msg: '验证码错误！'
            });
            console.info(
                chalk.yellow(req.body.email + '验证码错误！IP为：' + IP)
            )
            return false;
        }
        let params = {
            email: email
        }
        let result = await userData.findUser(params).catch((err) => {
            res.send({
                code: 0,
                msg: '内部错误请联系管理员！'
            });
            console.error(
                chalk.red('数据库查询错误！')
            );
            throw err;
        })
        //判断是否有该用户
        if (result) {
            let filters = {
                email: email
            }
            let updataParams = {
                ip: IP,
                password: md5(password),
                token: ''
            }
            await userData.updataUser(filters, updataParams).catch((err) => {
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
                msg: '密码修改成功！'
            });
            console.info(
                chalk.green('邮箱：' + email + '，密码修改成功。IP为：' + IP)
            )
        } else {
            res.send({
                code: 0,
                msg: '邮箱地址不存在！'
            });
            console.info(
                chalk.yellow(req.body.email + '邮箱地址不存在！，密码修改失败！IP为：' + IP)
            )
            return false;
        }
    } else {
        res.send({
            code: 0,
            msg: '参数不正确！'
        });
        console.info(
            chalk.yellow('参数不正确。IP为：' + IP)
        )
    }
}