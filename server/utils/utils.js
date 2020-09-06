var nodemailer = require('nodemailer');
var emailCodeModel = require('../models/emailCode');
var logModel = require('../models/log');
var jwt = require('jsonwebtoken');
var chalk = require('chalk');
var fs = require('fs');
var adminAccount = require('./database/adminAccount');
var userData = require('./database/user');
var marketData = require('./database/market');
var cardData = require('../data/cardData');

// 对战次数统计
exports.battleChance = (userData_) => {
    let battleChanceData = {
        add: 0,
        dataTime: Number(userData_.battleStamp),
        battleChance: userData_.battleDailyCount
    }
    // 如果剩余对战次数超过6则直接输出数据
    if (battleChanceData.battleChance > 6) {
        return battleChanceData;
    }
    let timeNow = Math.round(new Date().getTime() / 1000);
    let timeCha = Math.floor(timeNow - battleChanceData.dataTime);
    battleChanceData.add = Math.floor(timeCha / 3600);//1小时增加1次对战机会
    if (battleChanceData.add <= 0) {
        return battleChanceData;
    }
    battleChanceData.dataTime = battleChanceData.dataTime + battleChanceData.add * 3600;
    let newBattleChance = battleChanceData.battleChance + battleChanceData.add;
    if (newBattleChance <= 6) {
        battleChanceData.battleChance = newBattleChance;
        return battleChanceData;
    } else {
        battleChanceData.add = 6 - battleChanceData.battleChance;
        battleChanceData.battleChance = 6;
        return battleChanceData;
    }
}

// 机器人可疑度检测
exports.RobotCheck = async (userData_) => {
    // console.log(userData_.robotCheck)
    if (userData_.robotCheck) {
        return true;
    }
    let baseRobotCheck = 10 + userData_.robotRate + userData_.setRobotRate;
    let radomCheck = this.randomNum(1, 100);
    // console.log(radomCheck,baseRobotCheck)
    if (baseRobotCheck > radomCheck) {
        let filters = {
            email: userData_.email
        }
        let updataParams = {
            robotCheck: true,
            captchaLock: true,
            robotCheckTime: Math.round(new Date().getTime() / 1000)
        }
        await userData.updataUser(filters, updataParams).catch((err) => {
            console.error(
                chalk.red('数据库更新错误！')
            );
            return false;
        })
        console.info(
            chalk.green(userData_.email + '被随机检测是否是机器人，可疑度为：' + userData_.robotRate)
        );
        return true;
    } else {
        return false;
    }
}

// 随机数组
exports.randomArray = function (array, count) {
    const arr = [...array]
    let result = [];
    const ranNum = count;
    for (var i = 0; i < ranNum; i++) {
        let ran = Math.floor(Math.random() * (arr.length - i));
        result.push(arr[ran]);
        arr[ran] = arr[arr.length - i - 1];
    };
    return result
}
// 随机前面有0的数字
exports.randomNumberZero = function (count) {
    const hexArr = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
    const hex = this.randomArray(hexArr, count).join("");
    return hex
}
// 设置最低价格
exports.checkMinPrice = function (star) {
    // 设置最低价格
    let cardStar = star;
    let minPrice = null;
    if (cardStar == 6) {
        minPrice = 600;
    } else if (cardStar == 5) {
        minPrice = 200;
    } else if (cardStar == 4) {
        minPrice = 90;
    } else if (cardStar <= 3) {
        minPrice = 30;
    }
    return minPrice;
}
// 统计交易市场
exports.marketDataCalc = async function (cardId) {
    console.info(
        chalk.green('开始统计交易市场卡牌：' + cardId + '的最低最高价。')
    );
    let time = Math.round(new Date().getTime() / 1000);
    let search = {
        time: { $gte: time - 2592000 },
        cardId: cardId,
        selled: false
    };
    let lowData = await marketData.findMarket(1, 1, search, { 'price': 1 }).catch((err) => {
        throw err;
    });
    let highData = await marketData.findMarket(1, 1, search, { 'price': -1 }).catch((err) => {
        throw err;
    });
    if (lowData[1] || highData[1]) {
        let lowPrice = lowData[0][0].price;
        let highPrice = highData[0][0].price;
        let newLog = await marketData.findMarketLog(1, 1, { cardId: cardId }, { '_id': -1 }).catch((err) => {
            throw err;
        });
        if (newLog[1]) {
            console.info(
                chalk.green(cardId + '检查最高最低和上次一样吗？')
            );
            if (newLog[0][0].lowPrice == lowPrice && newLog[0][0].highPrice == highPrice) {
                const logId = newLog[0][0]["_id"];
                console.info(
                    chalk.green(cardId + '最高最低和上次一样。' + '记录ID为' + logId)
                );
                const parmas = {
                    time: time,
                }
                await marketData.updataMarketLog({ _id: logId }, parmas).catch((err) => {
                    throw err;
                });
                return false;
            }
        }
        let parmas = {
            time: time,
            cardId: cardId,
            lowPrice: lowPrice,
            highPrice: highPrice
        }
        await marketData.saveMarketLog(parmas).catch((err) => {
            throw err;
        });
        console.info(
            chalk.green(cardId + '的最低最高价更新成功。')
        );
        return true;
    } else {
        console.info(
            chalk.green(cardId + '没有最低最高价。')
        );
        return false;
    }
}
// 统计卡牌数量
exports.setCardCount = async function (email) {
    console.info(
        chalk.green('开始统计' + email + '的卡牌收集率。')
    );
    let params = { email: email }
    // document查询
    let result = await userData.findUser(params).catch((err) => {
        console.error(
            chalk.red('数据库查询错误！')
        );
        return false;
    })
    if (result && result.card) {
        let cardTotle = 0;
        let packageCache = Object.entries(result.card);
        for (let i = 0; i < packageCache.length; i++) {
            let userCardCache = Object.entries(packageCache[i][1]);
            cardTotle = cardTotle + userCardCache.length;
        }
        let filters = {
            email: email
        }
        let updataParams = {
            cardIndexCount: cardTotle
        }
        await userData.updataUser(filters, updataParams).catch((err) => {
            console.error(
                chalk.red('数据库更新错误！')
            );
            return false;
        })
        console.info(
            chalk.green('统计' + email + '的卡牌收集率成功，一共获取了' + cardTotle + '种卡牌。')
        );
        return true;
    } else {
        return false;
    }
}
//验证管理员密钥
exports.adminSK = async function (SK) {
    if (SK) {
        let params = {
            secretkey: SK
        }
        let result = await adminAccount.findAdmin(params).catch((err) => {
            console.error(
                chalk.red('数据库查询错误！')
            );
            return false;
        })
        if (result) {
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
}
exports.writeLog = function (logObject) {
    // document作成
    var log = new logModel(logObject);

    // document保存
    log.save(function (err) {
        if (err) {
            res.send({
                code: 0,
                msg: '内部错误请联系管理员！'
            });
            console.error(
                chalk.red('日志写入错误！')
            );
            throw err
        } else {
            console.info(
                chalk.green('邮箱：' + logObject.email + '，日志写入成功。')
            );
        };
    });
}
//检查token
exports.tokenCheck = async function (token) {
    let secretOrPrivateKey = global.myAppConfig.JWTSecret; // 这是加密的key（密钥）
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
exports.tokenCheckAndEmail = async function (token) {
    let tokenDecode = await this.tokenCheck(token).catch((err) => {
        console.info(
            chalk.yellow('登录信息已失效！')
        );
        return false;
    });
    if (!tokenDecode.email) {
        console.info(
            chalk.yellow('用户登录信息有误！')
        );
        return false;
    }
    let email = tokenDecode.email;
    console.info(
        chalk.green('邮箱解析结果为' + email)
    )
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
    if (!result) {
        return false;
    }
    if ((result.token != token) || (result.token == '')) {
        console.info(
            chalk.yellow(email + '和数据库的token对不上')
        )
        return false;
    } else {
        return result;
    }
}
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
//检查邮箱地址格式
exports.emailCheck = function (email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}
//检查密码格式
exports.passwordCheck = function (password) {
    return /^[\w_-]{4,16}$/.test(password)//4-16位英数字下划线减号
}
//检查昵称格式
exports.nickNameCheck = function (nickName) {
    return /^[\u4E00-\u9FA5\u0800-\u4e00A-Za-z0-9_]{2,8}$/.test(nickName)//2-8位中文、日文、英文、数字包括下划线
}
//检查数据库ID
exports.objectIDCheck = function (bjectID) {
    return /^[0-9a-f]{24}$/.test(bjectID)
}
//检查MD5
exports.md5Check = function (MD5) {
    return /^[A-Za-z0-9]{32}$/.test(MD5)//32位MD5
}
//区间内随机整数
exports.randomNum = function (n, m) {
    var random = Math.floor(Math.random() * (m - n + 1) + n);
    return random;
}
//数组去重
exports.unique = function (arr) {
    if (!Array.isArray(arr)) {
        return arr;
    }
    if (arr.length < 2) {
        return arr;
    }
    return Array.from(new Set(arr))
}
//数字补充0
exports.PrefixInteger = function (num, length) {
    if ((num + '').length > length) {
        return num + '';
    }
    return (Array(length).join('0') + num).slice(-length);
}
//随机抽卡
exports.wmCreatCardId = function ($randomCardRate) {
    $randomCardID = null;
    if ($randomCardRate >= 1 && $randomCardRate <= 64) {
        //N
        $randomCardN_ = this.randomNum(1, 122);
        $randomCardID = $randomCardN_ + '';
    } else if ($randomCardRate >= 65 && $randomCardRate <= 86) {
        //R
        $randomCardR_ = this.randomNum(1, 103);
        $randomCardID = '1' + this.PrefixInteger($randomCardR_, 3);
    } else if ($randomCardRate >= 87 && $randomCardRate <= 97) {
        //SR
        $randomCardSR_ = this.randomNum(1, 96);
        $randomCardID = '2' + this.PrefixInteger($randomCardSR_, 3);
    } else if ($randomCardRate > 97) {
        //SSR
        $randomCardSSR_ = this.randomNum(1, 62);
        $randomCardID = '3' + this.PrefixInteger($randomCardSSR_, 3);
    }
    return $randomCardID;
}
// 升级
exports.levelCheck = function (level, exp) {
    let cardData = fs.readFileSync('./data/cardData.json', 'utf8');
    cardData = JSON.parse(cardData)['level'];
    let level_ = Number(level);
    let exp_ = Number(exp);
    if (isNaN(level_) || isNaN(exp_)) {
        console.error(
            chalk.red('经验等级数据错误！')
        );
        throw '经验等级数据错误！';
    }
    let flag = true;
    let upNum = 0;//升级次数
    while (flag) {
        let levelIndex = level_;
        if (levelIndex > 5) {
            levelIndex = 5;
        }
        if (cardData[levelIndex] < exp_) {
            exp_ = exp_ - cardData[levelIndex];
            upNum++;
            level_++;
        } else {
            flag = false;
        }
    }
    return [level_, exp_, upNum]
}
//发送邮箱
exports.sendMail = function (email, IP) {
    return new Promise((resolve, reject) => {
        var code = this.randomNum(100001, 999999);
        var time = Math.round(new Date().getTime() / 1000);
        var mailTransport = nodemailer.createTransport({
            host: global.myAppConfig.smtpHost,
            port: global.myAppConfig.smtpPort,
            auth: {
                user: global.myAppConfig.smtpAuth.user,
                pass: global.myAppConfig.smtpAuth.pass
            }
        });

        mailTransport.sendMail({
            from: global.myAppConfig.smtpAuth.user, //你的邮箱
            to: email, //发给谁
            subject: '抽卡邮箱验证码',
            text: '您本次的邮箱验证码为：' + code + '。半小时内可重复使用！'
        }, function (err) {
            if (err) {
                reject('Unable to send email: ' + err);
                console.log(
                    chalk.red('Unable to send email: ' + err)
                );
            } else {
                console.log('给邮箱：' + email + '发送了验证码！');
                emailCodeModel.findOne({ email: email }, function (err, result) {
                    if (err) {
                        reject(err);
                        throw err;
                    } else {
                        let removeTime = time - 1800;
                        //判断是否有该邮箱
                        if (result) {
                            emailCodeModel.updateOne({ email: email }, { code: code, time: time, ip: IP }, function (err, docs) {
                                if (err) {
                                    throw err;
                                } else {
                                    emailCodeModel.deleteMany({ time: { $lte: removeTime } }, function (err, result) {
                                        if (err) {
                                            throw err;
                                        } else {
                                            resolve('ok');
                                        }
                                    });
                                }
                            })
                        } else {
                            // document作成
                            var emailCode = new emailCodeModel({
                                email: email,
                                code: code,
                                time: time,
                                ip: IP
                            });

                            // document保存
                            emailCode.save(function (err) {
                                if (err) {
                                    reject(err);
                                    throw err;
                                } else {
                                    emailCodeModel.deleteMany({ time: { $lte: removeTime } }, function (err, result) {
                                        if (err) {
                                            throw err;
                                        } else {
                                            resolve('ok');
                                        }
                                    });
                                };
                            });
                        }
                    }
                });
            }
        });
    })
}