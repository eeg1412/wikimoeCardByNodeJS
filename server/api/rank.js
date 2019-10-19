var userData = require('../utils/database/user');
var chalk = require('chalk');
var fs = require('fs');

module.exports = async function(req, res, next){
    let rankData = fs.readFileSync('./config/cache/rank.json', 'utf8');
    rankData = JSON.parse(rankData);
    res.send({
        code:1,
        data:rankData,
        msg:'ok'
    });
}