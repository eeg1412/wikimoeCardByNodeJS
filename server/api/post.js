const utils = require('../utils/utils');
const userData = require('../utils/database/user');
const chalk = require('chalk');
const cardData = require('../utils/database/cardData');
const itemDatabase = require('../utils/database/item');
const userPost = require('../utils/database/userPost');

module.exports = async function(req, res, next){
    let IP = utils.getUserIp(req);
    let type = req.body.type;
    let token = req.body.token;
    //解析token
    if(!token){
        res.send({
            code:404,
            msg:'token为空！'
        });
        return false;
    }
    let result = await utils.tokenCheckAndEmail(token).catch ((err)=>{
        throw err;
    });
    if(!result){
        res.send({
            code:404,
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
    const time = Math.round(new Date().getTime()/1000);
    // const delParmas = {
    //     endTime:{$gt:time},
    // }
    // 获取邮件
    if(type==='search'){
        // 获取邮件数据
        const page = req.body.page;
        const params = {
            email:email,
            endTime:{$gt:time},
        }
        const postDataRes = await userPost.findUserPost(20,page,params).catch ((err)=>{
            res.send({
                code:0,
                msg:'内部错误请联系管理员！'
            });
            console.error(
                chalk.red('数据库查询错误！')
            );
            throw err;
        });
        res.send({
            code:1,
            data:postDataRes[0],
            totle:postDataRes[1]
        });
    }else if(type==='get'){
        const _id = req.body.id;
        if(!utils.objectIDCheck(_id)){
            res.send({
                code:0,
                msg:'参数有误！'
            });
            console.info(
                chalk.yellow('email:'+email+'使用了不正确的数据库ID。IP为：'+IP)
            );
            return false;
        }
        // 查询该邮件数据
        const params = {
            _id:_id,
            email:email,
            endTime:{$gt:time},
        }
        const postDataOne = await userPost.findUserPostOne(params).catch ((err)=>{
            res.send({
                code:0,
                msg:'内部错误请联系管理员！'
            });
            console.error(
                chalk.red('数据库查询错误！')
            );
            throw err;
        }); 
        if(!postDataOne){
            res.send({
                code:0,
                msg:'无该邮件！'
            });
            console.info(
                chalk.yellow('email:'+email+'查询了不存在或者已经过期的邮件礼物。IP为：'+IP)
            );
            return false;
        }
        // 删除邮件
        const delParmas = {
            _id:_id,
        }
        await userPost.deletUserPost(delParmas).catch ((err)=>{
            throw err;
        });
        // 根据不同类型发放不同的礼物
        let getParams = {};
        const getType = postDataOne.type;
        const itemNumber = postDataOne.itemNumber;
        const itemId = postDataOne.itemId;
        if(getType==="star"){
            // 如果是送星星
            getParams = {
                $inc:{
                    star:itemNumber
                },
                ip:IP
            }
            await userData.updataUser({email:email},getParams).catch ((err)=>{
                res.send({
                    code:0,
                    msg:'内部错误请联系管理员！'
                });
                console.error(
                    chalk.red('数据库更新错误！')
                );
                throw err;
            })

        }else if(getType==="card"){
            // 如果是送卡牌
            let getCardData = {};
            getCardData['card.'+postDataOne.packageId+'.'+itemId] = itemNumber;
            getParams = {
                $inc:getCardData,
                ip:IP
            }
            await userData.updataUser({email:email},getParams).catch ((err)=>{
                res.send({
                    code:0,
                    msg:'内部错误请联系管理员！'
                });
                console.error(
                    chalk.red('数据库更新错误！')
                );
                throw err;
            })
        }else if(getType==="item"){
            let getItemData = {};
            getItemData['item.'+itemId] = itemNumber;
            getParams = {
                $inc:getItemData
            }
            await itemDatabase.findOneAndUpdate({email:email},getParams).catch ((err)=>{
                res.send({
                    code:0,
                    msg:'内部错误请联系管理员！'
                });
                console.error(
                    chalk.red('数据库更新错误！')
                );
                throw err;
            })
        }else{
            res.send({
                code:0,
                msg:'领取失败，请联系管理员！'
            });
            console.info(
                chalk.yellow('email:'+email+'领取邮件礼物失败可能是存在错误的数据。IP为：'+IP)
            );
            return false;
        }
        console.info(
            chalk.green('email:'+email+'成功领取了邮件道具。IP为：'+IP)
        );
        res.send({
            code:1,
            msg:'领取成功！卡牌和道具请刷新或重新进入相关页面后查看！'
        });
    }
}