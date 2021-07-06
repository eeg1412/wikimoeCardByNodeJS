const userUtils = require('../mongodb/utils/users');
const chalk = require('chalk');
const md5 = require('md5');

module.exports = async function (req, res, next) {
    const password = req.body.password;
    const account = req.body.account;
    if (password && account) {
        const userInfo = {
            account: account,
            password: md5(password),
        }
        const hasUser = await userUtils.findOne({ account: account });
        if (hasUser) {
            res.send({
                code: 0,
                msg: '该账户已存在！'
            });
            return false;
        }
        await userUtils.save(userInfo);
        res.send({
            code: 1,
            msg: '注册成功！'
        });
    } else {
        res.send({
            code: 0,
            msg: '信息不能为空！'
        });
    }

};