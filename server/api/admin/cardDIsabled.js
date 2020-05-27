const chalk = require('chalk');
const utils = require('../../utils/utils');
const cardData = require('../../utils/database/cardData');
const adminUtils = require('../../utils/admin/adminUtils');
const marketData = require('../../utils/database/market');
const wantCardData = require('../../utils/database/wantCard');
const base64Img = require('base64-img');

module.exports = async function (req, res, next) {
    const IP = utils.getUserIp(req);
    const token = req.body.token;
    const disabled = req.body.disabled ? true : false;

    const id_ = req.body.id;

    console.info(
        chalk.green('开始屏蔽卡牌,IP为：' + IP)
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
    const cardParams = {
        disabled: disabled
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

    // 如果为屏蔽则替换卡牌立绘为已屏蔽

    // 将现有卡牌移动至回收站

    // 如果为不屏蔽则将回收站的卡牌改回

    res.send({
        code: 1,
        msg: '修改成功！'
    });

    let logObj = {
        text: '使用管理员账号' + adminAccount + '修改了卡牌屏蔽,卡牌ID为：' + cardMongoData._id,
        ip: IP
    }
    adminUtils.adminWriteLog(logObj);
}