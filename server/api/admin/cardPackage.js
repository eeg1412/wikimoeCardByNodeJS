var chalk = require('chalk');
var utils = require('../../utils/utils');
var cardPackageData = require('../../utils/database/cardPackage');
// var cardData = require('../../utils/database/cardData');
var adminUtils = require('../../utils/admin/adminUtils');
var fs = require('fs');

module.exports = async function(req, res, next){
    let IP = utils.getUserIp(req);
    let token = req.body.token;
    let type = req.body.type;
    console.info(
        chalk.green('开始增改新闻,IP为：'+IP)
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
    if(type==='add'){
        let name = req.body.name;
        if(!name){
            res.send({
                code:0,
                msg:'请输入卡包名！'
            });
            console.info(
                chalk.yellow('改卡包名参数有误！,IP为：'+IP)
            )
            return false;
        }
        console.info(
            chalk.green(adminAccount+'开始增加卡包,IP为：'+IP)
        )
        //获取一共多少种卡包
        let cardpackageCount = await cardPackageData.findCardPackageCount({}).catch((err)=>{
            res.send({
                code:0,
                msg:'内部错误请联系管理员！'
            });
            console.error(
                chalk.red('数据库查询错误！')
            );
            throw err;
        });
        console.info(
            chalk.green('当前有'+cardpackageCount+'种卡包。')
        )
        let newPackageId = cardpackageCount+1;
        let params = {
            name:name,
            open:false,
            packageId:newPackageId
        }
        await cardPackageData.saveCardPackage(params).catch((err)=>{
            res.send({
                code:0,
                msg:'内部错误请联系管理员！'
            });
            console.error(
                chalk.red('数据库查询错误！')
            );
            throw err;
        });
        fs.mkdir('./public/card/'+newPackageId)
        res.send({
            code:1,
            msg:'增加卡包成功！'
        });
        console.info(
            chalk.green(adminAccount+'增卡包成功,IP为：'+IP)
        )
        let logObj = {
            text:'使用管理员账号'+adminAccount+'增加了卡包。《'+params.name+'》',
            ip:IP
        }
        adminUtils.adminWriteLog(logObj);
    }else if(type==='edit'){
        let name = req.body.name;
        if(!name){
            res.send({
                code:0,
                msg:'请输入卡包名！'
            });
            console.info(
                chalk.yellow('改卡包名参数有误！,IP为：'+IP)
            )
            return false;
        }
        console.info(
            chalk.green(adminAccount+'开始改卡包名,IP为：'+IP)
        )
        let _id = req.body._id;
        let params = {
            _id:_id
        }
        let resault = await cardPackageData.findCardPackageOne(params).catch((err)=>{
            res.send({
                code:0,
                msg:'内部错误或者卡包ID有误！'
            });
            console.error(
                chalk.red(err)
            );
            return false;
        });
        if(!resault){
            res.send({
                code:0,
                msg:'无该卡包！'
            });
            return false;
        }
        let params_ = {
            name:name,
        }
        await cardPackageData.updataCardPackage(params,params_).catch((err)=>{
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
            msg:'修改成功！'
        });
        let logObj = {
            text:'使用管理员账号'+adminAccount+'修改了卡包名。新卡包名：《'+params_.name+'》',
            ip:IP
        }
        adminUtils.adminWriteLog(logObj);
        console.info(
            chalk.green(adminAccount+'改卡包名成功,IP为：'+IP)
        )
    }else if(type==='open'){
        let open = req.body.open?true:false;
        console.info(
            chalk.green(adminAccount+'开始打开或关闭卡包,IP为：'+IP)
        )
        let _id = req.body._id;
        let params = {
            _id:_id
        }
        let resault = await cardPackageData.findCardPackageOne(params).catch((err)=>{
            res.send({
                code:0,
                msg:'内部错误或者卡包ID有误！'
            });
            console.error(
                chalk.red(err)
            );
            return false;
        });
        if(!resault){
            res.send({
                code:0,
                msg:'无该卡包！'
            });
            return false;
        }
        if(resault.packageId=='0'){
            res.send({
                code:0,
                msg:'基础卡包无法开关！'
            });
            return false;
        }
        if(open){
            if((resault.oneStar+resault.twoStar+resault.threeStar)<3 || resault.fourStar<3 || resault.fiveStar<3 || resault.sixStar<3){
                res.send({
                    code:0,
                    msg:'卡包卡牌数量不足，无法开启！'
                });
                return false;
            }
        }
        let params_ = {
            open:open,
        }
        await cardPackageData.updataCardPackage(params,params_).catch((err)=>{
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
            msg:'修改成功！'
        });
        let logObj = {
            text:'使用管理员账号'+adminAccount+(open?'打开':'关闭')+'卡包名：《'+resault.name+'》',
            ip:IP
        }
        adminUtils.adminWriteLog(logObj);
        console.info(
            chalk.green(adminAccount+'卡包开关成功,IP为：'+IP)
        )
    }else{
        res.send({
            code:0,
            msg:'参数有误！'
        });
        let logObj = {
            text:'使用管理员账号'+adminAccount+'使用了不正确的新闻参数！',
            ip:IP
        }
        adminUtils.adminWriteLog(logObj);
        console.info(
            chalk.green(adminAccount+'参数有误,IP为：'+IP)
        )
    }
}