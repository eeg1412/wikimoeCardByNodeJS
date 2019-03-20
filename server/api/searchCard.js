var usersModel = require('../models/users');
var md5 = require('md5-node');
var utils = require('../utils/utils');
module.exports = function(req, res, next){
    console.log(req.body);
    let userMD5 = req.body.md5;
    if(!utils.md5Check(userMD5)){
        res.send({
            code:0,
            msg:'参数有误！'
        });
        return false;
    }
    usersModel.findOne({ md5: userMD5 }, function(err, result) {
        if (err) {
            res.send({
                code:0,
                msg:'内部错误请联系管理员！'
            });
            throw err;
        }else{
            if(result){
                res.send({
                    code:1,
                    card:result.card,
                    md5:result.md5,
                    nickName:result.nickName,
                    score:result.result,
                    level:result.level
                });
            }else{
                res.send({
                    code:0,
                    msg:'无该用户信息！'
                });
            }
        }
    });
}