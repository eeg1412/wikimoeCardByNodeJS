var usersModel = require('../models/users');
var utils = require('../utils/utils');
var emailCodeModel = require('../models/emailCode');
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
    console.log(req.body);
    // 数据验证
    if(req.body.email&&req.body.captcha&&req.body.type){//判断是否有数据
        //验证邮箱
        let email = req.body.email;
        let captcha = req.body.captcha;
        let type = req.body.type;
        let IP = utils.getUserIp(req);
        if(!utils.emailCheck(email)){
            res.send({
                code:0,
                msg:'邮箱格式有误！'
            });
            return false;
        }
        if(req.session.captcha!=captcha){
            res.send({
                code:0,
                msg:'验证码有误！'
            });
            return false;
        }
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
                return false;
            }
        }
        usersModel.findOne({ email: email }, async function(err, result) {
            if (err) {
                res.send({
                    code:0,
                    msg:'内部错误请联系管理员！'
                });
                throw err;
            }else{
                //判断是否有该用户
                if(result){
                    if(type==='find'){
                        let send = await sendMail(email,IP);
                        if(send==='ok'){
                            res.send({
                                code:1,
                                msg:'发送成功！'
                            });
                        }else{
                            res.send({
                                code:0,
                                msg:'发送失败！'
                            });
                        }
                    }else if(type==='reg'){
                        res.send({
                            code:0,
                            msg:'该邮箱已注册！'
                        });
                        return false;
                    }else{
                        res.send({
                            code:0,
                            msg:'参数有误！'
                        });
                        return false;
                    }
                }else{
                    if(type==='reg'){
                        let send = await sendMail(email,IP);
                        if(send==='ok'){
                            res.send({
                                code:1,
                                msg:'发送成功！'
                            });
                        }else if(type==='find'){
                            res.send({
                                code:0,
                                msg:'该邮箱未注册！'
                            });
                            return false;
                        }else{
                            res.send({
                                code:0,
                                msg:'发送失败！'
                            });
                        }
                    }else{
                        res.send({
                            code:0,
                            msg:'参数有误！'
                        });
                        return false;
                    }
                }
            }
        });
    }else{
        res.send({
            code:0,
            msg:'参数有误！'
        });
        return false;
    }
}