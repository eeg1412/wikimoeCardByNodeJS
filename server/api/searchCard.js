var utils = require('../utils/utils');
var fs = require('fs');
var userData = require('../utils/database/user');
var chalk = require('chalk');
module.exports = async function(req, res, next){
    console.info(
        chalk.green('查询'+req.body.md5+'的卡牌。')
    );
    let userMD5 = req.body.md5;
    if(!utils.md5Check(userMD5)){
        res.send({
            code:0,
            msg:'参数有误！'
        });
        return false;
    }
    let params = { md5: userMD5 };
    let result = await userData.findUser(params).catch ((err)=>{
        res.send({
            code:0,
            msg:'内部错误请联系管理员！'
        });
        console.error(
            chalk.red('数据库查询错误！')
        );
        throw err;
    })
    if(result){
        let cardData = fs.readFileSync('./data/cardData.json', 'utf8');
        cardData = JSON.parse(cardData)['cardData'];
        res.send({
            code:1,
            card:result.card,
            md5:result.md5,
            nickName:result.nickName,
            score:result.score,
            level:result.level,
            cardCount:Object.keys(cardData).length
        });
    }else{
        res.send({
            code:0,
            msg:'无该用户信息！'
        });
    }
}