var jwt = require('jsonwebtoken');
var chalk = require('chalk');
const userUtils = require('../mongodb/utils/users');

//获取用户IP
exports.getUserIp = function (req) {
    let ip = req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress || '';
    ip = ip.match(/\d+.\d+.\d+.\d+/);
    ip = ip ? ip.join('.') : 'No IP';
    return ip;
};
//检查token
exports.tokenCheck = async function (token) {
    let secretOrPrivateKey = process.env.JWT_SECRET_KEY || 'test'; // 这是加密的key（密钥）
    return await new Promise((resolve, reject) => {
        jwt.verify(token, secretOrPrivateKey, function (err, decode) {
            if (err) {  //  时间失效的时候/ 伪造的token 
                console.info(
                    chalk.yellow('token有误！')
                );
                reject(err);
            } else {
                console.info(
                    chalk.green('token解密成功！')
                );
                resolve(decode);
            }
        });
    });
};
exports.checkTokenAndAccount = async function (token) {
    let tokenDecode = await this.tokenCheck(token).catch((err) => {
        console.info(
            chalk.yellow('登录信息已失效！')
        );
        return false;
    });
    if (!tokenDecode.account) {
        console.info(
            chalk.yellow('用户登录信息有误！')
        );
        return false;
    }
    let account = tokenDecode.account;
    console.info(
        chalk.green('账户解析结果为' + account)
    )
    let params = {
        account: account
    }
    let result = await userUtils.findOne(params).catch((err) => {
        res.send({
            code: 0,
            msg: '内部错误请联系管理员！'
        });
        console.error(
            chalk.red('数据库查询错误！')
        );
        throw err;
    })
    if (!result) {
        return false;
    }
    if ((result.token != token) || (result.token == '')) {
        console.info(
            chalk.yellow(account + '和数据库的token对不上')
        )
        return false;
    } else {
        return result;
    }
}