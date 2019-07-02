var cardPackageDatabase = require('../utils/database/cardPackage.js');
module.exports = async function(req, res, next){
    let all = req.body.all;
    let params = {open:true}
    if(all){
        params = {};
    }
    let cardPackage = await cardPackageDatabase.findCardPackageMany(params).catch ((err)=>{
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
        data:cardPackage,
        msg:'ok！'
    });
}