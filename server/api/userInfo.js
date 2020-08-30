var utils = require('../utils/utils');
var fs = require('fs');
var userData = require('../utils/database/user');
var chalk = require('chalk');
module.exports = async function (req, res, next) {
    let token = req.body.token;
    let IP = utils.getUserIp(req);
    console.info(
        chalk.green('获取用户信息。IP为：' + IP)
    );
    if (token) {
        let tokenDecode = await utils.tokenCheck(token).catch((err) => {
            res.send({
                code: 403,
                msg: '账户信息已失效，请重新登录！'
            });
            console.info(
                chalk.yellow('登录信息已失效！')
            );
            throw err;
        });
        if (!tokenDecode.email) {
            res.send({
                code: 403,
                msg: '账户信息已失效，请重新登录！'
            });
            console.info(
                chalk.yellow('登录信息有误！')
            );
            return false;
        }
        let email = tokenDecode.email;
        console.info(
            chalk.green(IP + '的邮箱解析结果为' + email)
        )
        let notParams = '-_id star level exp md5 score nickName token deminingStarCount cardIndexCount questCount guessCardCount UCC'
        let params = {
            email: email
        }
        let result = await userData.findUserNotAll(params, notParams).catch((err) => {
            res.send({
                code: 0,
                msg: '内部错误请联系管理员！'
            });
            console.error(
                chalk.red('数据库查询错误！')
            );
            throw err;
        })
        if (result) {
            if ((result.token != token) || (result.token == '')) {
                res.send({
                    code: 403,
                    msg: '账户信息已失效，请重新登录！'
                });
                console.info(
                    chalk.yellow(email + '和数据库的token对不上,IP为：' + IP)
                );
                return false;
            }
            console.info(
                chalk.green(email + '成功获取了自己的信息')
            )
            const sendData = {
                cardIndexCount: result.cardIndexCount,
                deminingStarCount: result.deminingStarCount,
                exp: result.exp,
                level: result.level,
                md5: result.md5,
                nickName: result.nickName,
                score: result.score,
                star: result.star,
                questCount: result.questCount,
                guessCardCount: result.guessCardCount,
                UCC: result.UCC,
            }
            res.send({
                code: 1,
                data: result
            });
        } else {
            console.info(
                chalk.yellow(email + '邮箱不存在，IP为：' + IP)
            )
            res.send({
                code: 403,
                msg: '无该用户信息！'
            });
            return false;
        }
    } else {
        console.info(
            chalk.yellow(IP + '参数有误！')
        )
        res.send({
            code: 403,
            msg: 'token为空！'
        });
        return false;
    }
}