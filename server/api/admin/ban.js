var chalk = require('chalk');
var utils = require('../../utils/utils');
var userData = require('../../utils/database/user');
var adminUtils = require('../../utils/admin/adminUtils');
const logModel = require('../../models/log');
module.exports = async function (req, res, next) {
    let IP = utils.getUserIp(req);
    let token = req.body.token;
    let _id = req.body.id;
    let type = req.body.type;
    console.info(
        chalk.green('开始封禁或者解封用户,IP为：' + IP)
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
    let result = await adminUtils.checkAdmin(token, IP);
    if (!result) {
        res.send({
            code: 402,
            msg: '账户信息已失效，请重新登录！'
        });
        console.info(
            chalk.yellow('token解析失败,IP为：' + IP)
        )
        return false;
    }
    let banType = 0;
    if (type == 'ban') {
        banType = 1;
    }
    let filters = { _id: _id };
    let parmas = {
        ban: banType,
        token: ''
    };
    userData.updataUser(filters, parmas).catch((err) => {
        res.send({
            code: 0,
            msg: '内部错误，更新失败！'
        });
        console.error(
            chalk.red('数据库更新错误！')
        );
        throw err;
    })
    let text = '解封成功！';
    if (type == 'ban') {
        text = '封号成功！';
        const playerData = await userData.findUser(filters);
        if (playerData) {
            const playerMD5 = playerData.md5;
            const logUpdate = await logModel.updateMany({ md5: playerMD5 }, { show: false });
        }
    }
    let logObj = {
        text: '管理员' + result.account + '对id：' + _id + text,
        ip: IP
    }
    adminUtils.adminWriteLog(logObj);
    console.info(
        chalk.green(text + '操作IP：' + IP)
    );
    res.send({
        code: 1,
        msg: text
    });
}