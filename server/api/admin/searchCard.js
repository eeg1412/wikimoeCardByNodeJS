const chalk = require('chalk');
const utils = require('../../utils/utils');
const cardData = require('../../utils/database/cardData');
const adminUtils = require('../../utils/admin/adminUtils');

module.exports = async function(req, res, next){
    let IP = utils.getUserIp(req);
    let token = req.body.token;
    console.info(
        chalk.green('开始查询卡牌——后台,IP为：'+IP)
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
    let resultAdmin = await adminUtils.checkAdmin(token,IP);
    if(!resultAdmin){
        res.send({
            code:402,
            msg:'账户信息已失效，请重新登录！'
        });
        console.info(
            chalk.yellow('token解析失败,IP为：'+IP)
        )
        return false;
    }
    
    let adminAccount = resultAdmin.account;
    
    const packageId = req.body.packageId || '0';
    const star = isNaN(Math.round(req.body.star))?0:Math.round(req.body.star);
    const cry = isNaN(Math.round(req.body.cry))?0:Math.round(req.body.cry);
    const rightType = isNaN(Math.round(req.body.rightType))?0:Math.round(req.body.rightType);
    const leftType = isNaN(Math.round(req.body.leftType))?0:Math.round(req.body.leftType);
    const title = req.body.title || null;
    const name = req.body.name || null;
    const page = isNaN(Math.round(req.body.page))?1:Math.round(req.body.page);

    let params = {}
    if(packageId!=="-1"){
        params['packageId'] = packageId;
    }
    if(star>0){
        params['star'] = star;
    }
    if(cry>0){
        params['cry'] = cry;
    }
    if(rightType>0){
        params['rightType'] = rightType;
    }
    if(leftType>0){
        params['leftType'] = leftType;
    }
    if(title){
        const titleReg=new RegExp(title,'i');
        params['title'] =  {$regex:titleReg};
    }
    if(name){
        const nameReg=new RegExp(name,'i');
        params['name'] =  {$regex:nameReg};
    }
    // 查询卡牌
    const cardDataRes = await cardData.findCardData(50,page,params).catch ((err)=>{
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
        data:cardDataRes[0],
        totle:cardDataRes[1]
    });

}