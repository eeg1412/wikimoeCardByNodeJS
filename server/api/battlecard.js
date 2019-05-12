var utils = require('../utils/utils');
var userData = require('../utils/database/user');
var md5 = require('md5-node');
var chalk = require('chalk');

// 数组去重
function uniq(array){
    var temp = []; //一个新的临时数组
    for(var i = 0; i < array.length; i++){
        if(temp.indexOf(array[i]) == -1){
            temp.push(array[i]);
        }
    }
    return temp;
}

module.exports = async function(req, res, next){
    let IP = utils.getUserIp(req);
    let type = req.body.type;
    let card = req.body.card;
    let token = req.body.token;
    //先解析token
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
    if(type=='search'){
        // 查卡组
        console.info(
            chalk.green(email+'成功查询了自己的战斗卡组，IP为：'+IP)
        )
        res.send({
            code:1,
            data:result.battleCard,
            msg:'ok'
        });
    }else if(type=='save'){
        let isArr = card instanceof Array;
        // 传参必须是数组
        if(!isArr){
            console.info(
                chalk.yellow(email+'传了非数组的卡组，IP为：'+IP)
            )
            res.send({
                code:0,
                msg:'卡组信息有误！'
            });
            return false;
        }
        // 去个重
        card = uniq(card);
        console.info(
            chalk.green(email+'上传的战斗卡组为'+card+'，IP为：'+IP)
        )
        // 卡牌必须有20张
        if(card.length!==20){
            console.info(
                chalk.yellow(email+'传了不足20的卡组，IP为：'+IP)
            )
            res.send({
                code:0,
                msg:'出战卡牌必须要有20张才行哦！如果您还没有20张卡组请努力抽卡吧！'
            });
            return false;
        }
        // 验证用户是否有该卡片
        for(let i=0;i<card.length;i++){
            let cardNum = result.card[card[i]];
            if(!(cardNum>0)){
                console.log(cardNum);
                console.info(
                    chalk.yellow(email+'传了他没有的战斗卡组，卡牌编号为：'+card[i]+'，IP为：'+IP)
                )
                res.send({
                    code:0,
                    msg:'出战卡牌必须要有20张才行哦！如果您还没有20张卡组请努力抽卡吧！'
                });
                return false;
            }
        }
        // 验证通过了
        let filters = {
            email: email
        }
        let updataParams = {
            battleCard:card,
            ip:IP
        }
        await userData.updataUser(filters,updataParams).catch ((err)=>{
            res.send({
                code:0,
                msg:'内部错误请联系管理员！'
            });
            console.error(
                chalk.red('数据库更新错误！')
            );
            throw err;
        })
        console.info(
            chalk.green(email+'成功保存了战斗卡组，IP为：'+IP)
        )
        res.send({
            code:1,
            msg:'卡组保存成功！'
        });
    }
}