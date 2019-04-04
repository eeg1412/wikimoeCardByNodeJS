var usersModel = require('../models/users');
exports.login = function(req, res, next){
    console.log(req.body);
    res.send(req.body);
    // document作成
    var user = new usersModel({
        email:'abc@abc.com'
    });

    // document保存
    user.save(function(err) {
        if (err) throw err;
    });
}