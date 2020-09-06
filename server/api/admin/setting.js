var chalk = require('chalk');
var utils = require('../../utils/utils');
var adminUtils = require('../../utils/admin/adminUtils');
var fs = require('fs');
var validator = require('validator');
const cheerio = require('cheerio');

module.exports = async function (req, res, next) {
    let IP = utils.getUserIp(req);
    let token = req.body.token;
    let type = req.body.type;
    let config_ = req.body.config;
    console.info(
        chalk.green('开始查询或修改配置信息,IP为：' + IP)
    )
    if (!token) {
        res.send({
            code: 402,
            msg: '参数不正确！'
        });
        return false;
    }
    let checkAdminResult = await adminUtils.checkAdmin(token, IP);
    let account = checkAdminResult.account;
    if (!checkAdminResult) {
        res.send({
            code: 402,
            msg: '账户信息已失效，请重新登录！'
        });
        console.info(
            chalk.yellow('token解析失败,IP为：' + IP)
        )
        let logObj = {
            text: '尝试更改系统设置，但是token错误。',
            ip: IP
        }
        adminUtils.adminWriteLog(logObj);
        return false;
    }
    if (type == 'get') {
        console.info(
            chalk.green(account + '为查询配置,IP为：' + IP)
        )
        let myConfig = fs.readFileSync('./config/config.json', 'utf8');
        myConfig = JSON.parse(myConfig);
        const footerHTML = fs.readFileSync('templete/footer.html', 'utf8');
        myConfig["footer"] = footerHTML;
        const hiddenWords = fs.readFileSync('./data/hiddenWords.txt', 'utf8');
        myConfig["hiddenWords"] = hiddenWords;
        res.send({
            code: 1,
            data: myConfig,
            msg: 'ok！'
        });
        console.info(
            chalk.green(account + '配置信息查询成功,IP为：' + IP)
        )
    } else if (type == 'edit') {
        console.info(
            chalk.green(account + '为查询修改配置,IP为：' + IP)
        )
        if (!config_) {
            console.info(
                chalk.yellow(account + '并没有要修改的配置信息,IP为：' + IP)
            )
            res.send({
                code: 0,
                msg: '参数不正确！'
            });
            return false;
        }
        // 校验数据
        try {
            if (validator.isEmpty(config_.sessionSecret, { ignore_whitespace: false })) {
                res.send({
                    code: 0,
                    msg: 'session加密字符串不能为空！'
                });
                console.info(
                    chalk.yellow(IP + 'session加密字符串不能为空！')
                );
                return false;
            }
            if (validator.isEmpty(config_.JWTSecret, { ignore_whitespace: false })) {
                res.send({
                    code: 0,
                    msg: 'JWT加密字符串不能为空！'
                });
                console.info(
                    chalk.yellow(IP + 'JWT加密字符串不能为空！')
                );
                return false;
            }
            if (!validator.isInt(config_.dailyChance.toString(), { min: 1 })) {
                res.send({
                    code: 0,
                    msg: '每日抽卡次数必须是大于1的数字'
                });
                console.info(
                    chalk.yellow(IP + '每日抽卡次数必须是大于1的数字')
                );
                return false;
            }
            if (validator.isEmpty(config_.smtpHost, { ignore_whitespace: false })) {
                res.send({
                    code: 0,
                    msg: '邮件发送host不能为空！'
                });
                console.info(
                    chalk.yellow(IP + '邮件发送host不能为空！')
                );
                return false;
            }
            if (!validator.isInt(config_.smtpPort.toString(), { min: 1 })) {
                res.send({
                    code: 0,
                    msg: '邮件发送端口必须是大于1的数字'
                });
                console.info(
                    chalk.yellow(IP + '邮件发送端口必须是大于1的数字')
                );
                return false;
            }
            if (validator.isEmpty(config_.smtpAuthUser, { ignore_whitespace: false })) {
                res.send({
                    code: 0,
                    msg: '邮件用户名不能为空！'
                });
                console.info(
                    chalk.yellow(IP + '邮件用户名不能为空！')
                );
                return false;
            }
            if (validator.isEmpty(config_.smtpAuthPass, { ignore_whitespace: false })) {
                res.send({
                    code: 0,
                    msg: '邮件密码不能为空！'
                });
                console.info(
                    chalk.yellow(IP + '邮件密码不能为空！')
                );
                return false;
            }
            if (!validator.isInt(config_.robotCheckStar.toString(), { min: 1 })) {
                res.send({
                    code: 0,
                    msg: '机器人验证通过后送的星星必须是大于1的数字'
                });
                console.info(
                    chalk.yellow(IP + '机器人验证通过后送的星星必须是大于1的数字')
                );
                return false;
            }
            if (!validator.isInt(config_.robotCheckCanGetStar.toString(), { min: 1 })) {
                res.send({
                    code: 0,
                    msg: '机器人可疑度低于这个值送星星必须是大于1的数字'
                });
                console.info(
                    chalk.yellow(IP + '机器人可疑度低于这个值送星星必须是大于1的数字')
                );
                return false;
            }
            if (!validator.isInt(config_.deminingStarRatio.toString(), { min: 1 })) {
                res.send({
                    code: 0,
                    msg: '挖矿获得星星的倍率必须是大于1的数字'
                });
                console.info(
                    chalk.yellow(IP + '挖矿获得星星的倍率必须是大于1的数字')
                );
                return false;
            }
            if (!validator.isInt(config_.deminingItemRatio.toString(), { min: 1 })) {
                res.send({
                    code: 0,
                    msg: '挖矿获得宝石的倍率必须是大于1的数字'
                });
                console.info(
                    chalk.yellow(IP + '挖矿获得宝石的倍率必须是大于1的数字')
                );
                return false;
            }
            if (!validator.isInt(config_.creatCardStar.toString(), { min: 1 })) {
                res.send({
                    code: 0,
                    msg: '制卡审核通过后获得的星星必须是大于1的数字'
                });
                console.info(
                    chalk.yellow(IP + '制卡审核通过后获得的星星必须是大于1的数字')
                );
                return false;
            }
            if (!validator.isInt(config_.creatCardWait.toString(), { min: 1 })) {
                res.send({
                    code: 0,
                    msg: '单用户最多等待审核的制卡必须是大于1的数字'
                });
                console.info(
                    chalk.yellow(IP + '单用户最多等待审核的制卡必须是大于1的数字')
                );
                return false;
            }
            if (!validator.isInt(config_.useMarketCardCount.toString(), { min: 1 })) {
                res.send({
                    code: 0,
                    msg: '集齐多少种卡牌后能在市场交易必须是大于1的数字'
                });
                console.info(
                    chalk.yellow(IP + '集齐多少种卡牌后能在市场交易必须是大于1的数字')
                );
                return false;
            }
            if (!validator.isInt(config_.battleRankGetItem.toString(), { min: 1 })) {
                res.send({
                    code: 0,
                    msg: '竞技第一名额外获得结缘币的数量必须是大于1的数字'
                });
                console.info(
                    chalk.yellow(IP + '竞技第一名额外获得结缘币的数量必须是大于1的数字')
                );
                return false;
            }
            if (!validator.isInt(config_.battleRankGetItemDecay.toString(), { min: 1 })) {
                res.send({
                    code: 0,
                    msg: '后面陆续获得结缘币的衰减数量必须是大于1的数字'
                });
                console.info(
                    chalk.yellow(IP + '后面陆续获得结缘币的衰减数量必须是大于1的数字')
                );
                return false;
            }
        }
        catch (error) {
            res.send({
                code: 0,
                msg: '参数有误！'
            });
            console.info(
                chalk.yellow('设置参数有误', error)
            );
            return false;
        }
        let opt = {
            init: 'true',
            sessionSecret: config_.sessionSecret,//session加密字符串
            JWTSecret: config_.JWTSecret,//JWT加密字符串
            dailyChance: Number(config_.dailyChance),//每日抽卡次数
            smtpHost: config_.smtpHost,//邮件发送host
            smtpPort: Number(config_.smtpPort),//邮件发送端口
            smtpAuth: {
                user: config_.smtpAuthUser,//用户名
                pass: config_.smtpAuthPass//密码
            },
            robotCheckStar: Number(config_.robotCheckStar),//机器人验证通过后送的星星
            robotCheckCanGetStar: Number(config_.robotCheckCanGetStar),//机器人可疑度低于这个值送星星
            deminingStarRatio: Number(config_.deminingStarRatio),//挖矿获得星星的倍率
            deminingItemRatio: Number(config_.deminingItemRatio),//挖矿获得宝石的倍率
            creatCardStar: Number(config_.creatCardStar),//制卡审核通过后获得的星星
            creatCardWait: Number(config_.creatCardWait),//单用户最多等待审核的制卡
            useMarketCardCount: Number(config_.useMarketCardCount),//集齐多少种卡牌后能在市场卖卡
            battleRankGetItem: Number(config_.battleRankGetItem),//竞技第一名额外获得结缘币的数量
            battleRankGetItemDecay: Number(config_.battleRankGetItemDecay),//后面陆续获得结缘币的衰减数量
            donateImgUrl: config_.donateImgUrl || '',//捐赠图片URL地址
            creatCardExplainUrl: config_.creatCardExplainUrl || '',//制卡说明图片URL地址
            QQunURL: config_.QQunURL || '',//加群链接
            courseURL: config_.courseURL || '',//教程链接
            browserTitle: config_.browserTitle || '维基萌抽卡',//浏览器标签标题
            siteTitle: config_.siteTitle || '维基萌抽卡',//网站标题
        };
        adminUtils.writeGlobalOpt(opt);
        fs.writeFileSync("templete/footer.html", config_.footer || "", 'utf8');
        const $ = cheerio.load(fs.readFileSync('public/index.html', 'utf8'), { decodeEntities: false });
        const footerHTML = fs.readFileSync('templete/footer.html', 'utf8');
        $('#wm_index_footer').html(footerHTML);
        $('title').text(global.myAppConfig.browserTitle || "维基萌抽卡");
        fs.writeFileSync("public/index.html", $.html());
        fs.writeFileSync('./data/hiddenWords.txt', config_.hiddenWords || "", 'utf8');
        res.send({
            code: 1,
            msg: '修改配置成功'
        });
        let logObj = {
            text: '管理员账号' + account + '，修改了配置。',
            ip: IP
        }
        adminUtils.adminWriteLog(logObj);
        console.info(
            chalk.green(account + '修改配置成功。IP为：' + IP)
        );
    } else {
        console.info(
            chalk.yellow(account + '没有请求配置类型,IP为：' + IP)
        )
        res.send({
            code: 0,
            msg: '参数不正确！'
        });
    }
}