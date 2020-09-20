var cardPackageDatabase = require('../utils/database/cardPackage.js');
const cardPackageSortData = require('../utils/database/cardPackageSort');
module.exports = async function (req, res, next) {
    let all = req.body.all;
    const sortType = req.body.sortType || "";
    let params = {}
    if (all) {
        params = {};
    }
    let cardPackage = await cardPackageDatabase.findCardPackageMany(params).catch((err) => {
        res.send({
            code: 0,
            msg: '内部错误请联系管理员！'
        });
        console.error(
            chalk.red('数据库查询错误！')
        );
        throw err;
    });
    let packageSortParams = {};
    const sortTypeList = ["default", "open", "starShopOpen", "guessOpen", "starCoinOpen", "submitOpen"];
    if (sortTypeList.indexOf(sortType) >= 0) {
        packageSortParams = {
            type: sortType
        }
    }
    const sortData = await cardPackageSortData.findMany(packageSortParams).catch((err) => {
        res.send({
            code: 0,
            msg: '内部错误请联系管理员！'
        });
        console.error(
            chalk.red('数据库查询错误！')
        );
        throw err;
    });
    res.send({
        code: 1,
        data: cardPackage,
        sortData: sortData || [],
        msg: 'ok！'
    });
}