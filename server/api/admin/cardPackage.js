var chalk = require('chalk');
var utils = require('../../utils/utils');
var cardPackageData = require('../../utils/database/cardPackage');
const cardPackageSortData = require('../../utils/database/cardPackageSort');
// var cardData = require('../../utils/database/cardData');
var adminUtils = require('../../utils/admin/adminUtils');
var fs = require('fs');
const _ = require('lodash');
const validator = require('validator');

module.exports = async function (req, res, next) {
    let IP = utils.getUserIp(req);
    let token = req.body.token;
    let type = req.body.type;
    console.info(
        chalk.green('开始卡包处理,IP为：' + IP)
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
    if (type === 'sort') {
        const sortType = req.body.sortType || "";
        const sortList = req.body.sortList || [];
        const sortTypeList = ["default", "open", "starShopOpen", "guessOpen", "starCoinOpen", "submitOpen"];
        if (sortTypeList.indexOf(sortType) < 0) {
            res.send({
                code: 0,
                msg: '不存在该类型排序！'
            });
            console.info(
                chalk.yellow('给卡包排序，但是不存在该类型排序,IP为：' + IP)
            )
            return false;
        }
        // 检查列表数据
        if (!_.isArray(sortList)) {
            res.send({
                code: 0,
                msg: '排序列表不正确！'
            });
            console.info(
                chalk.yellow('给卡包排序，但是排序列表不正确,IP为：' + IP)
            )
            return false;
        }
        let idIsError = false;
        for (let i = 0; i < sortList.length; i++) {
            const isId = validator.isMongoId(sortList[i] + "");
            if (!isId) {
                idIsError = true;
                break;
            }
        }
        if (idIsError) {
            res.send({
                code: 0,
                msg: '排序列表数据不正确！'
            });
            console.info(
                chalk.yellow('给卡包排序，但是排序列表数据不正确,IP为：' + IP)
            )
            return false;
        }
        const conditions = {
            type: sortType
        }
        const update = {
            packageSortList: sortList
        }
        await cardPackageSortData.findOneAndUpdate(conditions, update).catch((err) => {
            res.send({
                code: 0,
                msg: '内部错误请联系管理员！'
            });
            console.error(
                chalk.red('数据库查询错误！')
            );
            throw err;
        });

        res.send({
            code: 1,
            msg: '修改成功！'
        });
        let logObj = {
            text: '使用管理员账号' + adminAccount + '修改了卡包排序！类型为：' + sortType,
            ip: IP
        }
        adminUtils.adminWriteLog(logObj);
        console.info(
            chalk.green(adminAccount + '修改卡包排序成功,IP为：' + IP)
        )

    } else if (type === 'add') {
        let name = req.body.name;
        if (!name) {
            res.send({
                code: 0,
                msg: '请输入卡包名！'
            });
            console.info(
                chalk.yellow('改卡包名参数有误！,IP为：' + IP)
            )
            return false;
        }
        console.info(
            chalk.green(adminAccount + '开始增加卡包,IP为：' + IP)
        )
        //获取一共多少种卡包
        let cardpackageCount = await cardPackageData.findCardPackageCount({}).catch((err) => {
            res.send({
                code: 0,
                msg: '内部错误请联系管理员！'
            });
            console.error(
                chalk.red('数据库查询错误！')
            );
            throw err;
        });
        console.info(
            chalk.green('当前有' + cardpackageCount + '种卡包。')
        )
        let newPackageId = cardpackageCount + 1;
        let params = {
            name: name,
            open: false,
            packageId: newPackageId
        }
        await cardPackageData.saveCardPackage(params).catch((err) => {
            res.send({
                code: 0,
                msg: '内部错误请联系管理员！'
            });
            console.error(
                chalk.red('数据库查询错误！')
            );
            throw err;
        });
        fs.mkdirSync('./public/card/' + newPackageId)
        res.send({
            code: 1,
            msg: '增加卡包成功！'
        });
        console.info(
            chalk.green(adminAccount + '增卡包成功,IP为：' + IP)
        )
        let logObj = {
            text: '使用管理员账号' + adminAccount + '增加了卡包。《' + params.name + '》',
            ip: IP
        }
        adminUtils.adminWriteLog(logObj);
    } else if (type === 'edit') {
        let name = req.body.name;
        if (!name) {
            res.send({
                code: 0,
                msg: '请输入卡包名！'
            });
            console.info(
                chalk.yellow('改卡包名参数有误！,IP为：' + IP)
            )
            return false;
        }
        console.info(
            chalk.green(adminAccount + '开始改卡包名,IP为：' + IP)
        )
        let _id = req.body._id;
        let params = {
            _id: _id
        }
        let resault = await cardPackageData.findCardPackageOne(params).catch((err) => {
            res.send({
                code: 0,
                msg: '内部错误或者卡包ID有误！'
            });
            console.error(
                chalk.red(err)
            );
            return false;
        });
        if (!resault) {
            res.send({
                code: 0,
                msg: '无该卡包！'
            });
            return false;
        }
        let params_ = {
            name: name,
        }
        await cardPackageData.updataCardPackage(params, params_).catch((err) => {
            res.send({
                code: 0,
                msg: '内部错误请联系管理员！'
            });
            console.error(
                chalk.red('数据库查询错误！')
            );
            throw err;
        });
        res.send({
            code: 1,
            msg: '修改成功！'
        });
        let logObj = {
            text: '使用管理员账号' + adminAccount + '修改了卡包名。新卡包名：《' + params_.name + '》',
            ip: IP
        }
        adminUtils.adminWriteLog(logObj);
        console.info(
            chalk.green(adminAccount + '改卡包名成功,IP为：' + IP)
        )
    } else if (type === 'daily' || type === 'shop' || type === 'guess' || type === 'starCoin' || type === 'submitOpen') {
        let open = req.body.open ? true : false;
        console.info(
            chalk.green(adminAccount + '开始打开或关闭卡包,IP为：' + IP)
        )
        let _id = req.body._id;
        let params = {
            _id: _id
        }
        let resault = await cardPackageData.findCardPackageOne(params).catch((err) => {
            res.send({
                code: 0,
                msg: '内部错误或者卡包ID有误！'
            });
            console.error(
                chalk.red(err)
            );
            return false;
        });
        if (!resault) {
            res.send({
                code: 0,
                msg: '无该卡包！'
            });
            return false;
        }
        // 校验每种卡包是否符合要求
        // if (!open && type !== 'submitOpen') {
        //     if (resault.packageId == '0') {
        //         res.send({
        //             code: 0,
        //             msg: '基础卡包无法开关！'
        //         });
        //         return false;
        //     }
        // }
        if (type === 'daily') {
            if (open) {
                if ((resault.oneStar + resault.twoStar + resault.threeStar) < 3 || resault.fourStar < 3 || resault.fiveStar < 3 || resault.sixStar < 3) {
                    res.send({
                        code: 0,
                        msg: '卡包卡牌数量不足，无法开启！'
                    });
                    return false;
                }
            }
        } else if (type === 'starCoin' || type === 'shop' || type === 'guess') {
            if (open) {
                if ((resault.oneStar + resault.twoStar + resault.threeStar) < 1 || resault.fourStar < 1 || resault.fiveStar < 1 || resault.sixStar < 1) {
                    res.send({
                        code: 0,
                        msg: '卡包卡牌数量不足，无法开启！'
                    });
                    return false;
                }
            }
        }
        if (!open) {
            let type_ = {}
            if (type === 'daily') {
                type_ = {
                    open: true,
                }
            } else if (type === 'shop') {
                type_ = {
                    starShopOpen: true,
                }
            } else if (type === 'guess') {
                type_ = {
                    guessOpen: true,
                }
            } else if (type === 'starCoin') {
                type_ = {
                    starCoinOpen: true,
                }
            } else if (type === 'submitOpen') {
                type_ = {
                    submitOpen: true,
                }
            }
            // 查询开放的卡包
            const resaultPackage = await cardPackageData.findCardPackageMany(type_).catch((err) => {
                console.error(
                    chalk.red(err)
                );
                return false;
            });
            if (type === 'daily' || type === 'starCoin' || type === 'shop' || type === 'guess') {
                if (resaultPackage.length <= 1) {
                    res.send({
                        code: 0,
                        msg: '起码要有1种卡包开放！'
                    });
                    return false;
                }
            }
            if (type === 'guess') {
                let starSix = 0;
                let starFive = 0;
                let starFour = 0;
                let starThree = 0;
                resaultPackage.forEach((item) => {
                    starSix = starSix + item.sixStar;
                    starFive = starFive + item.fiveStar;
                    starFour = starFour + item.fourStar;
                    starThree = starThree + item.threeStar + item.twoStar + item.oneStar;
                });
                starSix = starSix - resault.sixStar;
                starFive = starFive - resault.fiveStar;
                starFour = starFour - resault.fourStar;
                starThree = starThree - resault.threeStar - resault.twoStar - resault.oneStar;
                // 判断卡牌够不够
                if (starSix < 1) {
                    res.send({
                        code: 0,
                        msg: '起码要有1张6星卡！'
                    });
                    return false;
                } else if (starFive < 2) {
                    res.send({
                        code: 0,
                        msg: '起码要有2张5星卡'
                    });
                    return false;
                } else if (starFour < 5) {
                    res.send({
                        code: 0,
                        msg: '起码要有5张4星卡！'
                    });
                    return false;
                } else if (starThree < 42) {
                    res.send({
                        code: 0,
                        msg: '起码要有42张3星及其以下的卡！'
                    });
                    return false;
                }
            }
        }
        // 设置每种卡包开关
        let params_ = {}
        if (type === 'daily') {
            params_ = {
                open: open,
            }
        } else if (type === 'shop') {
            params_ = {
                starShopOpen: open,
            }
        } else if (type === 'guess') {
            params_ = {
                guessOpen: open,
            }
        } else if (type === 'starCoin') {
            params_ = {
                starCoinOpen: open,
            }
        } else if (type === 'submitOpen') {
            params_ = {
                submitOpen: open,
            }
        }
        // 判断关闭的时候是否合格
        if (!open) {

        }
        // 写入数据库
        await cardPackageData.updataCardPackage(params, params_).catch((err) => {
            res.send({
                code: 0,
                msg: '内部错误请联系管理员！'
            });
            console.error(
                chalk.red('数据库查询错误！')
            );
            throw err;
        });
        res.send({
            code: 1,
            msg: '修改成功！'
        });
        let logObj = {
            text: '使用管理员账号' + adminAccount + (open ? '打开' : '关闭') + '卡包名：《' + resault.name + '》,类别：' + type,
            ip: IP
        }
        adminUtils.adminWriteLog(logObj);
        console.info(
            chalk.green(adminAccount + '卡包开关成功,IP为：' + IP)
        )
    } else {
        res.send({
            code: 0,
            msg: '参数有误！'
        });
        let logObj = {
            text: '使用管理员账号' + adminAccount + '使用了不正确的新闻参数！',
            ip: IP
        }
        adminUtils.adminWriteLog(logObj);
        console.info(
            chalk.green(adminAccount + '参数有误,IP为：' + IP)
        )
    }
}