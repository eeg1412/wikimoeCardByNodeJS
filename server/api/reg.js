var usersModel = require('../models/users');
var emailCodeModel = require('../models/emailCode');
var md5 = require('md5-node');
var utils = require('../utils/utils');
var chalk = require('chalk');
var userData = require('../utils/database/user');
var oldUsersModel = require('../models/oldUsers');
module.exports = async function(req, res, next){
    let IP = utils.getUserIp(req);
    console.info(
        chalk.green(req.body.email+'提交了一次注册！IP为：'+IP)
    )
    // 数据验证
    if(req.body.email&&req.body.nickName&&req.body.password){//判断是否有数据
        //验证邮箱
        let email = req.body.email;
        let nickName = req.body.nickName;
        let password = req.body.password;
        let emailCode = req.body.emailCode;
        let SK = req.body.secretkey;
        if(!utils.emailCheck(email)){
            res.send({
                code:0,
                msg:'邮箱格式有误！'
            });
            console.info(
                chalk.yellow(req.body.email+'邮箱格式有误！IP为：'+IP)
            )
            return false;
        }
        if(!utils.passwordCheck(password)){
            res.send({
                code:0,
                msg:'密码必须为4-8位纯数字'
            });
            console.info(
                chalk.yellow(req.body.email+'密码格式有误！IP为：'+IP)
            )
            return false;
        }
        if(!utils.nickNameCheck(nickName)){
            res.send({
                code:0,
                msg:'昵称只能允许为2-8位中英日数字与下划线！'
            });
            console.info(
                chalk.yellow(req.body.email+'昵称格式有误！IP为：'+IP)
            )
            return false;
        }
        let adminSK_ = false;
        if(SK){
            adminSK_ = await utils.adminSK(SK);
        }
        let emailCodeData = null;
        if(!adminSK_){
            emailCodeData = await emailCodeModel.findOne({ email: email }, function(err, result) {
                if (err) {
                    throw err;
                }else{
                    //判断是否有该邮箱
                    if(result){
                        return result;
                    }else{
                        return null;
                    }
                }
            });
            if(emailCodeData){
                let time = Math.round(new Date().getTime()/1000);
                if(time - emailCodeData.time>1800){
                    res.send({
                        code:0,
                        msg:'验证码已过期！'
                    }); 
                    console.info(
                        chalk.yellow(req.body.email+'验证码过期！IP为：'+IP)
                    )
                    return false;
                }else if(emailCodeData.code!==emailCode){
                    res.send({
                        code:0,
                        msg:'验证码错误！'
                    });
                    console.info(
                        chalk.yellow(req.body.email+'验证码错误！IP为：'+IP)
                    )
                    return false;
                }
            }else{
                res.send({
                    code:0,
                    msg:'验证码错误！'
                }); 
                console.info(
                    chalk.yellow(req.body.email+'验证码错误！IP为：'+IP)
                )
                return false;
            }
        }
        let params = {
            email:email
        }
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
        //判断是否有该用户
        if(result){
            res.send({
                code:0,
                msg:'该邮箱已注册！'
            }); 
            console.info(
                chalk.yellow(req.body.email+'邮箱已注册，注册失败！IP为：'+IP)
            )
            return false;
        }else{
            // 查询旧版数据
            var oldData = await oldUsersModel.findOne({md5:md5(email)}, function(err, result) {
                if (err) {
                    throw err;
                }else{
                    if(result){
                        return result;
                    }
                }
            });
            var creatAccountData = {
                email:email,
                nickName:nickName,
                password:md5(password),
                md5:md5(email),
                ip:IP
            }
            if(oldData){
                let BouerseStar = 0;
                if(oldData.bouerse){
                    let oldBouerse = JSON.parse(oldData.bouerse);
                    for(var i in oldBouerse) {
                        BouerseStar = BouerseStar + oldBouerse[i].have*35;//股票每股35转换为星星
                    }
                }
                creatAccountData['star'] = Number(oldData.starCount)+BouerseStar+600;//老账户送600星星
                creatAccountData['score'] = Number(oldData.score);
                creatAccountData['level'] = Number(oldData.level);
                creatAccountData['exp'] = Number(oldData.exp);
                creatAccountData['deminingStarCount'] = Number(oldData.deminingStarStarCount);
                let oldCardId = oldData.cardID.split(',');
                let oldCardCount = oldData.cardCount.split(',');
                let oldCard = {};
                for(let i = 0;i<oldCardId.length;i++){
                    oldCard[Number(oldCardId[i])] = Number(oldCardCount[i])
                }
                creatAccountData['card'] = oldCard;
                let userCardCache = Object.entries(oldCard);
                let cardTotle = userCardCache.length;
                creatAccountData['cardIndexCount'] = cardTotle;
            }
            // document作成
            var user = new usersModel(creatAccountData);

            // document保存
            user.save(function(err) {
                if (err) {
                    res.send({
                        code:0,
                        msg:'内部错误请联系管理员！'
                    });
                    throw err
                }else{
                    let logObject = {
                        email:email,
                        md5:md5(email),
                        nickName:nickName,
                        type:'register',
                        time:Math.round(new Date().getTime()/1000),
                        data:{},
                        ip:IP
                    }
                    utils.writeLog(logObject);
                    res.send({
                        code:1,
                        msg:'注册成功！'
                    });
                    console.info(
                        chalk.green('邮箱：'+email+'，注册成功。IP为：'+IP)
                    )
                };
            });
        }
    }else{
        res.send({
            code:0,
            msg:'参数不正确！'
        });
        console.info(
            chalk.yellow('参数不正确。IP为：'+IP)
        )
    }
}