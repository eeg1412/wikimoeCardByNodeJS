var utils = require('../utils/utils');
var dailyUtils = require('../utils/dailyGetItem');
var userData = require('../utils/database/user');
var dailyData = require('../utils/database/userDaliyGetItem');
var itemDatabase = require('../utils/database/item');
var chalk = require('chalk');
var fs = require('fs');
var itemInfo = require('../data/item.json');

module.exports = async function(req, res, next){
    let IP = utils.getUserIp(req);
    let type = req.body.type;
    let captcha = req.body.captcha;
    let token = req.body.token;
    let SK = req.body.secretkey;
    // 判断验证码
    let adminSK_ = false;
    if(SK){
        adminSK_ = await utils.adminSK(SK);
    }
    if(!adminSK_ && type!=='search'){
        if(req.session.captcha!=captcha || !captcha){
            await req.session.destroy((err)=> {
                if(err){
                    console.info(
                        chalk.red(IP+'验证码清理失败'+'，'+err)
                    );
                }
            })
            res.send({
                code:0,
                msg:'验证码有误，或者已经过期！'
            });
            console.info(
                chalk.yellow('图形验证码有误。IP为：'+IP)
            );
            return false;
        }
        await req.session.destroy((err)=> {
            if(err){
                console.info(
                    chalk.red(IP+'验证码清理失败'+'，'+err)
                );
            }
        })
    }
    //解析token
    if(!token){
        console.info(
            chalk.yellow(IP+'参数有误！')
        )
        res.send({
            code:403,
            msg:'token为空！'
        });
        return false;
    }
    let result = await utils.tokenCheckAndEmail(token).catch ((err)=>{
        throw err;
    });
    if(!result){
        res.send({
            code:403,
            msg:'账户信息已失效，请重新登录！'
        });
        console.info(
            chalk.yellow('查询结果无该用户,IP为：'+IP)
        );
        return false;
    }
    let email = result.email;
    console.info(
        chalk.green(IP+'的邮箱解析结果为'+email)
    )
    // 获取补签道具数量
    let itemData_ = await itemDatabase.findOne({email:email}).catch ((err)=>{
        res.send({
            code:0,
            msg:'内部错误请联系管理员！'
        });
        console.error(
            chalk.red('数据库错误！')
        );
        throw err;
    }) || {};
    let userItemData = itemData_['item'] || {};//获取道具信息
    let myItemNum = userItemData['201'] || 0;
    //检查每日道具是否过期
    let dailyGetItemJson = fs.readFileSync('./config/cache/dailyGetItem.json', 'utf8');
    dailyGetItemJson=JSON.parse(dailyGetItemJson);
    let DataTime = new Date(dailyGetItemJson['time']).getFullYear() + '' + (new Date(dailyGetItemJson['time']).getMonth() + 1);
    let timeNow = new Date();
    //将时间都转换成年月
    let timeNowYearMonth = timeNow.getFullYear() + '' + (timeNow.getMonth() + 1);
    if(DataTime!==timeNowYearMonth){//日月不对
        console.info(
            chalk.yellow('每日签到数据太久，重新生成。')
        );
        dailyGetItemJson = dailyUtils.creatNewItemList(timeNow.getMonth() + 1,timeNow.getFullYear());
        dailyGetItemJson = JSON.parse(dailyGetItemJson);
    }
    //查询用户信息
    let params = {
        email:email
    }
    let getInfo = '-_id -email';
    let userDailyInfo = await dailyData.findOne(params,getInfo).catch ((err)=>{
        res.send({
            code:0,
            msg:'内部错误请联系管理员！'
        });
        console.error(
            chalk.red('数据库错误！')
        );
        throw err;
    }) || {};
    let lastGetTime = Number(userDailyInfo['time'])*1000 || 0;
    let getCount = userDailyInfo['count'] || 0;
    //判断上次签到是不是本月的
    let lastGetTimeYearMonth = new Date(lastGetTime).getFullYear() + '' + (new Date(lastGetTime).getMonth() + 1);
    let geted = false;
    if(lastGetTimeYearMonth!==timeNowYearMonth){
        getCount = 0;
    }
    //判断今天是不是已经签到过了
    if(timeNow.toDateString()===new Date(lastGetTime).toDateString()){
        geted = true;
    }

    if(type==='search'){
        res.send({
            code:1,
            daily:dailyGetItemJson,
            getCount:getCount,
            geted:geted,
            canIssue:myItemNum,
            data:new Date().getDate(),
            msg:'ok'
        });
        console.info(
            chalk.green('email:'+email+'查询每日签到成功。IP为：'+IP)
        );
    }else if(type==='get'){
        // 是否是补签
        let reissue = req.body.reissue;
        //判断今天是不是已经签到过了
        if(geted){
            // 如果已经签到了
            if(reissue){
                // 判断是否能已经到最大补签
                const todayDay = timeNow.getDate();
                console.info(
                    chalk.yellow('email:'+email+'尝试补签，已经累计签到'+getCount+'次，最多能签到'+todayDay+'次。IP为：'+IP)
                );
                if(getCount>=todayDay){
                    res.send({
                        code:0,
                        msg:'不能超过日期补签！'
                    });
                    console.error(
                        chalk.yellow('email:'+email+'尝试补签，日期超了。IP为：'+IP)
                    );
                    return false;
                }
                // 判断补签道具够不够
                if(myItemNum<1){
                    res.send({
                        code:0,
                        msg:'您的补签道具不足！'
                    });
                    console.error(
                        chalk.yellow('email:'+email+'尝试补签，但是补签道具不足。IP为：'+IP)
                    );
                    return false;
                }
                
            }else{
                // 如果不是补签
                res.send({
                    code:0,
                    msg:'今天已经签到过啦！'
                });
                console.error(
                    chalk.yellow('email:'+email+'今天已经签到了。IP为：'+IP)
                );
                return false;
            }
        }else{
            // 如果判断今天没签到过，则即使使用补签道具也不能补签
            if(reissue){
                res.send({
                    code:0,
                    msg:'您今天还没签到，不能补签！如页面显示领取，请刷新页面！'
                });
                console.error(
                    chalk.yellow('email:'+email+'没有签到就尝试补签。IP为：'+IP)
                );
                return false;
            }
        }
        let canGetItem = dailyGetItemJson['item'][getCount];
        if(!canGetItem){
            res.send({
                code:0,
                msg:'已超过本月签到最大次数！'
            });
            console.error(
                chalk.yellow('email:'+email+'签到次数超过一个月的日子。IP为：'+IP)
            );
            return false;
        }
        let updateContent = {};
        let msgText = '';
        if(canGetItem['item']==='star'){//送星星
            updateContent = {
                $inc:{
                    star:canGetItem['num']
                },
                ip:IP
            }
            //更新数据库
            await userData.updataUser(params,updateContent).catch ((err)=>{
                res.send({
                    code:0,
                    msg:'内部错误请联系管理员！'
                });
                console.error(
                    chalk.red('数据库更新错误！')
                );
                throw err;
            })
            msgText=(reissue?'补签':'签到')+'成功，获得'+canGetItem['text'];
            // 如果补签扣除补签道具
            if(reissue){
                // 写入道具
                let update_ = {
                    'item.201': myItemNum-1
                }
                await itemDatabase.findOneAndUpdate(params,update_).catch ((err)=>{
                    res.send({
                        code:0,
                        msg:'内部错误请联系管理员！'
                    });
                    console.error(
                        chalk.red('数据库更新错误！')
                    );
                    throw err;
                })
            }
        }else if(canGetItem['item']==='radomItem'){//随机宝石
            let CryItemList = ['11','12','13','14','15','21','22','23','24','25','31','32','33','34','35','41','42','43','44','45','51','52','53','54','55'];
            let randomIndex = utils.randomNum(0,CryItemList.length-1);
            let getItemId = CryItemList[randomIndex];
            let getItemDataBase = {};
            getItemDataBase['item.'+getItemId] = canGetItem['num'];
            // 写入道具
            let update_ = {
                $inc:getItemDataBase
            }
            if(reissue){
                // 写入补签道具+1
                update_['item.201'] = myItemNum-1;
            }
            await itemDatabase.findOneAndUpdate(params,update_).catch ((err)=>{
                res.send({
                    code:0,
                    msg:'内部错误请联系管理员！'
                });
                console.error(
                    chalk.red('数据库更新错误！')
                );
                throw err;
            })
            msgText=(reissue?'补签':'签到')+'成功，获得'+itemInfo[getItemId].name+'×'+canGetItem['num'];
        }else {//指定道具
            let getItemId = canGetItem['item'];
            //判断道具是否存在
            let item__ = itemInfo[getItemId];
            if(!item__){
                res.send({
                    code:0,
                    msg:'签到数据异常，请联系管理员！'
                });
                console.error(
                    chalk.yellow('email:'+email+'签到了不存在的道具。IP为：'+IP)
                );
                return false;
            }
            //写入道具
            let getItemDataBase = {};
            getItemDataBase['item.'+getItemId] = canGetItem['num'];
            // 写入道具
            let update_ = {
                $inc:getItemDataBase
            }
            if(reissue){
                // 写入补签道具+1
                update_['item.201'] = myItemNum-1;
            }
            await itemDatabase.findOneAndUpdate(params,update_).catch ((err)=>{
                res.send({
                    code:0,
                    msg:'内部错误请联系管理员！'
                });
                console.error(
                    chalk.red('数据库更新错误！')
                );
                throw err;
            })
            msgText= (reissue?'补签':'签到')+'成功，获得'+canGetItem['text'];
        }
        //写入签到数据
        let dailyUpdate = {
            count:getCount+1
        };
        if(!reissue){
            dailyUpdate["time"] = timeNow.getTime()/1000;
        }
        dailyData.findOneAndUpdate(params,dailyUpdate)
        res.send({
            code:1,
            count:getCount+1,
            canIssue:reissue?myItemNum-1:myItemNum,
            msg:msgText
        });
        let logObject = {
            email:email,
            md5:result.md5,
            nickName:result.nickName,
            type:'dailyGetItem',
            time:timeNow.getTime()/1000,
            data:{
                msg:msgText
            },
            ip:IP
        }
        utils.writeLog(logObject);
        console.info(
            chalk.green('email:'+email+'签到成功！。IP为：'+IP)
        );
    }
}