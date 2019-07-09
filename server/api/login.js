var md5 = require('md5-node');
var utils = require('../utils/utils');
var chalk = require('chalk');
var userData = require('../utils/database/user');
var jwt = require('jsonwebtoken');
module.exports = async function(req, res, next){
    let IP = utils.getUserIp(req);
    let email = req.body.email;
    let password = req.body.password;
    let captcha = req.body.captcha;
    let remPass = req.body.remPass;
    let SK = req.body.secretkey;
    console.info(
        chalk.green(email+'开始登录！IP为：'+IP)
    )
    // 数据验证
    if(email&&password){//判断是否有数据
        if(!utils.emailCheck(email)){
            res.send({
                code:0,
                msg:'邮箱格式有误！'
            });
            console.info(
                chalk.yellow(email+'邮箱格式有误！IP为：'+IP)
            )
            return false;
        }
        if(!utils.passwordCheck(password)){
            res.send({
                code:0,
                msg:'账户或密码不正确！'
            });
            console.info(
                chalk.yellow(email+'密码格式有误！IP为：'+IP)
            )
            return false;
        }
        let adminSK_ = false;
        if(SK){
            adminSK_ = await utils.adminSK(SK);
        }
        if(!adminSK_){
            if(req.session.captcha!=captcha || !captcha){
                req.session.destroy((err)=> {
                    if(err){
                        console.info(
                            chalk.red(IP+'验证码清理失败'+'，'+err)
                        );
                    }
                })
                res.send({
                    code:0,
                    msg:'验证码有误！'
                });
                console.info(
                    chalk.yellow('email:'+email+'图形验证码有误。IP为：'+IP)
                );
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
        if(!result){
            res.send({
                code:0,
                msg:'无该用户！'
            });
            return false;
        }
        if(md5(password)!==result.password){
            res.send({
                code:0,
                msg:'账户或密码不正确！'
            });
            console.info(
                chalk.yellow(email+'密码错误！IP为：'+IP)
            )
            return false;
        }
        if(result.ban >0){
            res.send({
                code:0,
                msg:'该账户已被封禁！'
            });
            console.info(
                chalk.yellow(req.body.email+'已被封禁！IP为：'+IP)
            );
            return false;
        }
        let shouldNewToken = true;
        if(result.token){
            //如果有Token则解析
            let tokenDecode = await utils.tokenCheck(result.token).catch ((err)=>{
                console.info(
                    chalk.yellow('登录信息已失效生成新的token！')
                );
            });
            if(tokenDecode){
                try{
                    let timeNow = Math.round(new Date().getTime()/1000);
                    let expiresIn = tokenDecode.exp;
                    if(expiresIn - timeNow > 86400){
                        //如果token还有效则不更新token
                        console.info(
                            chalk.green(email+'的token还有效则不更新token')
                        );
                        shouldNewToken = false;
                    }
                }catch(err){
                    console.info(
                        chalk.yellow('登录信息解析成功，但是信息却有误！')
                    );
                }
            }
        }
        let token = result.token;
        if(shouldNewToken){
            let content ={email:email}; // 要生成token的主题信息
            let secretOrPrivateKey= global.myAppConfig.JWTSecret; // 这是加密的key（密钥）
            let remTime = 60*60*24;
            if(remPass){
                remTime = '365d';
            }
            token = jwt.sign(content, secretOrPrivateKey, {
                expiresIn: remTime
            });
        }
        let filters = {
            email: email
        }
        let updataParams = {
            token:token,
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
        res.send({
            code:1,
            msg:'ok',
            token:token
        });
        console.info(
            chalk.green(email+'登录成功！IP为：'+IP)
        )
    }else{
        res.send({
            code:0,
            msg:'参数有误！'
        });
    }
}