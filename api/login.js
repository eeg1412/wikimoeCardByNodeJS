const userUtils = require('../mongodb/utils/users');
const chalk = require('chalk');
var jwt = require('jsonwebtoken');

module.exports = async function (req, res, next) {
    const password = req.body.password;
    const account = req.body.account;
    if (password && account) {
        const hasUser = await userUtils.findOne({ account: account });
        if (hasUser) {
            let content = { account: account }; // 要生成token的主题信息
            let secretOrPrivateKey = process.env.JWT_SECRET_KEY || 'test'; // 这是加密的key（密钥）
            let remTime = 60 * 60 * 24;
            let token = jwt.sign(content, secretOrPrivateKey, {
                expiresIn: remTime
            });
            const params = { token: token };
            await userUtils.updateOne({ account: account }, params);
            res.send({
                code: 1,
                token: token,
                msg: '登录成功！'
            });
        } else {
            res.send({
                code: 0,
                msg: '账户或密码不正确！'
            });
        }

    } else {
        res.send({
            code: 0,
            msg: '信息不能为空！'
        });
    }

};