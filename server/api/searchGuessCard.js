const chalk = require('chalk');
const utils = require('../utils/utils');
const guessCardData = require('../utils/database/guessCard');

module.exports = async function(req, res, next){
    const IP = utils.getUserIp(req);
    const token = req.body.token;
    const type = req.body.type;
    console.info(
        chalk.green('开始查询猜卡,IP为：'+IP)
    )
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
    if(type==='history'){
        const page = isNaN(Math.round(req.body.page))?1:Math.round(req.body.page);
        const guessCardInfo = await guessCardData.findGuessCard(1,page,{open:false},{'time':-1},'-_id -__v').catch((err)=>{
            res.send({
                code:0,
                msg:'内部错误请联系管理员！'
            });
            console.error(
                chalk.red('数据库查询错误！')
            );
            throw err;
        });
        // 发送数据
        res.send({
            code:1,
            total:guessCardInfo[1],
            data:guessCardInfo[0],
            msg:'ok'
        });
    }else{
        let guessCardInfo = await guessCardData.findGuessCardOne({open:true}).catch((err)=>{
            res.send({
                code:0,
                msg:'内部错误请联系管理员！'
            });
            console.error(
                chalk.red('数据库查询错误！')
            );
            throw err;
        });
        // 发送数据
        res.send({
            code:1,
            data:guessCardInfo,
            msg:'ok'
        });
    }
}