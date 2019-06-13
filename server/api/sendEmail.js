var usersModel = require('../models/users');
var utils = require('../utils/utils');
var emailCodeModel = require('../models/emailCode');
var userData = require('../utils/database/user');
var chalk = require('chalk');
async function sendMail(email,IP) {
    try {
        await utils.sendMail(email,IP);
        return 'ok';
    } catch(err) {
        console.log(err);
        return err;
    }
}
module.exports = async function(req, res, next){
    let email = req.body.email;
    let IP = utils.getUserIp(req);
    console.info(
        chalk.green('email:'+email+'请求发送邮箱验证码。IP为：'+IP)
    );
    // 数据验证
    if(email&&req.body.captcha&&req.body.type){//判断是否有数据
        //验证邮箱
        let captcha = req.body.captcha;
        let type = req.body.type;
        if(!utils.emailCheck(email)){
            res.send({
                code:0,
                msg:'邮箱格式有误！'
            });
            console.info(
                chalk.yellow('email:'+email+'邮箱格式有误。IP为：'+IP)
            );
            return false;
        }
        email = email.toLowerCase();
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
        req.session.destroy((err)=> {
            if(err){
                console.info(
                    chalk.red(IP+'验证码清理失败'+'，'+err)
                );
            }
        })
        let emailCodeData = null;
        emailCodeData = await emailCodeModel.findOne({ email: email }, function(err, result) {
            if (err) {
                throw err;
            }else{
                //判断是否有该邮箱
                if(result){
                    return result;
                }
            }
        });
        if(emailCodeData){
            let time = Math.round(new Date().getTime()/1000);
            if(time - emailCodeData.time<60){
                res.send({
                    code:0,
                    msg:'验证码发送频率过快，请休息一会儿再发送吧！'
                }); 
                console.info(
                    chalk.yellow('email:'+email+'发送频率过快。IP为：'+IP)
                );
                return false;
            }
        }
        let send = await sendMail(email,IP);
        if(send==='ok'){
            res.send({
                code:1,
                msg:'发送成功！'
            });
            console.info(
                chalk.green('email:'+email+'邮箱验证码发送成功。IP为：'+IP)
            );
        }else{
            res.send({
                code:0,
                msg:'发送失败！'
            });
            console.info(
                chalk.yellow('email:'+email+'邮箱验证码发送失败。IP为：'+IP)
            );
        }
        // let params = { email: email };
        // let result = await userData.findUser(params).catch ((err)=>{
        //     res.send({
        //         code:0,
        //         msg:'内部错误请联系管理员！'
        //     });
        //     console.error(
        //         chalk.red('数据库查询错误！')
        //     );
        //     throw err;
        // })
        // //判断是否有该用户
        // if(result){
        //     if(type==='find'){
        //         let send = await sendMail(email,IP);
        //         if(send==='ok'){
        //             res.send({
        //                 code:1,
        //                 msg:'发送成功！'
        //             });
        //             console.info(
        //                 chalk.green('email:'+email+'邮箱验证码发送成功。IP为：'+IP)
        //             );
        //         }else{
        //             res.send({
        //                 code:0,
        //                 msg:'发送失败！'
        //             });
        //             console.info(
        //                 chalk.yellow('email:'+email+'邮箱验证码发送失败。IP为：'+IP)
        //             );
        //         }
        //     }else if(type==='reg'){
        //         res.send({
        //             code:0,
        //             msg:'该邮箱已注册！'
        //         });
        //         console.info(
        //             chalk.yellow('email:'+email+'邮箱验证码因已注册而失败。IP为：'+IP)
        //         );
        //         return false;
        //     }else{
        //         res.send({
        //             code:0,
        //             msg:'参数有误！'
        //         });
        //         console.info(
        //             chalk.yellow('IP为：'+IP+' 发送的参数有误！')
        //         );
        //         return false;
        //     }
        // }else{
        //     if(type==='reg'){
        //         let send = await sendMail(email,IP);
        //         if(send==='ok'){
        //             res.send({
        //                 code:1,
        //                 msg:'发送成功！'
        //             });
        //             console.info(
        //                 chalk.green('email:'+email+'邮箱验证码发送成功。IP为：'+IP)
        //             );
        //         }else if(type==='find'){
        //             res.send({
        //                 code:0,
        //                 msg:'该邮箱未注册！'
        //             });
        //             console.info(
        //                 chalk.yellow('email:'+email+'邮箱验证码因未注册而失败。IP为：'+IP)
        //             );
        //             return false;
        //         }else{
        //             res.send({
        //                 code:0,
        //                 msg:'发送失败！'
        //             });
        //             console.info(
        //                 chalk.yellow('email:'+email+'邮箱验证码发送失败。IP为：'+IP)
        //             );
        //         }
        //     }else{
        //         res.send({
        //             code:0,
        //             msg:'参数有误！'
        //         });
        //         console.info(
        //             chalk.yellow('IP为：'+IP+' 发送的参数有误！')
        //         );
        //         return false;
        //     }
        // }
    }else{
        res.send({
            code:0,
            msg:'参数有误！'
        });
        console.info(
            chalk.yellow('IP为：'+IP+' 发送的参数有误！')
        );
        return false;
    }
}