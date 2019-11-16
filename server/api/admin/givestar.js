const chalk = require('chalk');
const utils = require('../../utils/utils');
const userData = require('../../utils/database/user');
const adminUtils = require('../../utils/admin/adminUtils');
const cardData = require('../../utils/database/cardData');
const userPost = require('../../utils/database/userPost');
const itemInfo = require('../../data/item.json');

module.exports = async function(req, res, next){
    const IP = utils.getUserIp(req);
    const token = req.body.token;
    const sendAll = req.body.sendAll;
    const email = sendAll?null:req.body.email;
    const text = req.body.text || '赠与';
    const title = req.body.title || '来自管理员的赠与';
    const endTime = Math.round(req.body.endTime/1000);
    const type = req.body.type;
    const itemId = req.body.itemId;
    const cardId = req.body.cardId;
    const itemNumber = Math.round(req.body.itemNumber);

    console.info(
        chalk.green('开始赠送星星,IP为：'+IP)
    )
    if(!token){
        res.send({
            code:402,
            msg:'验证已失效'
        });
        console.info(
            chalk.yellow('token为空,IP为：'+IP)
        )
        return false;
    }
    if(isNaN(itemNumber)||itemNumber<=0){
        res.send({
            code:0,
            msg:'参数不正确！'
        });
        console.info(
            chalk.yellow(itemNumber+',itemNumber为非数值或为0,IP为：'+IP)
        )
        return false;
    }
    if(!utils.emailCheck(email)&&!sendAll){
        res.send({
            code:0,
            msg:'参数不正确！'
        });
        console.info(
            chalk.yellow(email+'邮箱地址有误,IP为：'+IP)
        )
        return false;
    }
    let result = await adminUtils.checkAdmin(token,IP);
    let account = result.account;
    if(!result){
        res.send({
            code:402,
            msg:'账户信息已失效，请重新登录！'
        });
        let logObj = {
            text:'尝试给'+email+'送星星，但是管理员token有误。',
            ip:IP
        }
        adminUtils.adminWriteLog(logObj);
        console.info(
            chalk.yellow('token解析失败,IP为：'+IP)
        )
        return false;
    }

    // 检查参数是否正确
    // 检测时间对不对
    const timeNow = Math.round(new Date().getTime()/1000);
    if(endTime < timeNow || isNaN(endTime)){
        res.send({
            code:0,
            msg:'过期时间设置有误，不能设置当前时间之前的时间！'
        });
        console.info(
            chalk.yellow('赠送传的结束时间比现在时间要早或者非数字,IP为：'+IP)
        )
        return false;
    }
    let itemName = "";
    // 初始化数据
    let saveParams = {};
    
    if(type==="card"){
        // 检测是否存在该卡
        const myCardData = await cardData.findCardDataOne({cardId:cardId}).catch ((err)=>{
            res.send({
                code:0,
                msg:'内部错误请联系管理员！'
            });
            console.error(
                chalk.red('数据库查询错误！')
            );
            throw err;
        });
        if(!myCardData){
            res.send({
                code:0,
                msg:'不存在这张卡！'
            });
            console.info(
                chalk.yellow('赠送了不存在的卡,IP为：'+IP)
            );
            return false;
        }
        saveParams = {
            text:text,
            title:title,
            time:timeNow,
            endTime:endTime,
            type:type,
            itemId:cardId,
            itemNumber:itemNumber,
            packageId:myCardData.packageId
        }
        itemName = '卡牌【'+myCardData.name+'】';
    }else if(type==="item"){
        // 检测是否存在该道具
        itemName = itemInfo[itemId];
        if(!itemName){
            res.send({
                code:0,
                msg:'不存在这个道具！'
            });
            console.info(
                chalk.yellow('赠送了不存在的卡,IP为：'+IP)
            );
            return false;
        }
        saveParams = {
            text:text,
            title:title,
            time:timeNow,
            endTime:endTime,
            type:type,
            itemId:itemId,
            itemNumber:itemNumber,
        };
        itemName = '道具【'+itemInfo[itemId].name+'】';
    }else if(type==="star"){
        saveParams = {
            text:text,
            title:title,
            time:timeNow,
            endTime:endTime,
            type:type,
            itemNumber:itemNumber,
        };
        // 如果是赠送星星
        itemName = "【星星】";
    }else{
        res.send({
            code:0,
            msg:'参数不正确！'
        });
        console.info(
            chalk.yellow('赠送传了不支持的类型参数,IP为：'+IP)
        )
        return false;
    }

    if(!sendAll){
        //如果不是全员赠送
        // 查询用户是否存在
        let userParams ={
            email:email
        }
        let userInfo = await userData.findUser(userParams);
        if(!userInfo){
            res.send({
                code:0,
                msg:'无该邮箱用户！'
            });
            console.info(
                chalk.yellow('没有这个送星星的用户,IP为：'+IP)
            )
            return false;
        }
        saveParams['email'] = email;
        // 写入数据
        await userPost.saveUserPost(saveParams).catch ((err)=>{
            res.send({
                code:0,
                msg:'内部错误，更新失败！'
            });
            console.error(
                chalk.red('数据库更新错误！')
            );
            throw err;
        })
    }else{
        // 循环未封号数据
        await userData.findUserMany({ban:0}).then(users=>users.forEach(async (item,index)=>{
            console.info(
                chalk.green('给'+item.email+'赠送礼物')
            );
            saveParams['email'] = item.email;
            // 写入数据
            await userPost.saveUserPost(saveParams).catch ((err)=>{
                res.send({
                    code:0,
                    msg:'内部错误，更新失败！'
                });
                console.error(
                    chalk.red('数据库更新错误！')
                );
                throw err;
            })
        }));
        console.info(
            chalk.green('循环赠送完毕')
        );
    }
    // 判断还有误，记得切换的时候前端数据还原
    res.send({
        code:1,
        msg:'成功给'+(email || '全员')+'赠送了'+itemName+'×'+itemNumber
    });
    let logObj = {
        text:'管理员账号'+account+'给邮箱：'+(email || '全员')+'赠送了'+itemName+'×'+itemNumber+'。',
        ip:IP
    }
    adminUtils.adminWriteLog(logObj);
}