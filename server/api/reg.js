var usersModel = require('../models/users');
var md5 = require('md5-node');
var utils = require('../utils/utils');
module.exports = function(req, res, next){
    console.log(req.body);
    // 数据验证
    if(req.body.email&&req.body.nickName&&req.body.password){//判断是否有数据
        //验证邮箱
        let email = req.body.email;
        let nickName = req.body.nickName;
        let password = req.body.password;
        if(!utils.emailCheck(email)){
            res.send({
                code:0,
                msg:'邮箱格式有误！'
            });
            return false;
        }
        if(!utils.passwordCheck(password)){
            res.send({
                code:0,
                msg:'密码必须为4-8位纯数字'
            });
            return false;
        }
        if(!utils.nickNameCheck(nickName)){
            res.send({
                code:0,
                msg:'昵称只能允许为2-8位中英日数字与下划线！'
            });
            return false;
        }
        usersModel.findOne({ email: email }, function(err, result) {
            if (err) {
                res.send({
                    code:0,
                    msg:'内部错误请联系管理员！'
                });
                throw err;
            }else{
                //判断是否有该用户
                if(result){
                    res.send({
                        code:0,
                        msg:'该邮箱已注册！'
                    }); 
                    return false;
                }else{
                    // document作成
                    var user = new usersModel({
                        email:email,
                        nickName:nickName,
                        password:md5(password),
                        md5:md5(email)
                    });

                    // document保存
                    user.save(function(err) {
                        if (err) {
                            res.send({
                                code:0,
                                msg:'内部错误请联系管理员！'
                            });
                            throw err
                        }else{
                            res.send({
                                code:1,
                                msg:'注册成功！'
                            });
                            console.log('邮箱：'+email+'，注册成功。');
                        };
                    });
                }
            }
        });
    }else{
        res.send({
            code:0,
            msg:'参数不正确！'
        });
    }
}