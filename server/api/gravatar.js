let request = require("request")
var fs = require("fs");
var chalk = require('chalk');

module.exports = function(req, res, next){
	let md5 = req.query.md5;
	var url = 'https://cdn.v2ex.com/gravatar/'+md5+'?s=100&d=mm&r=g&d=robohash';
    var options = {
		url: url,
		encoding: null,
		timeout:15000
    };
    request.get(options, (error, response, body)=>{
		if (!error && response.statusCode === 200) {
			console.info(
				chalk.green('头像加载成功')
			)
			let ctype = response.headers['content-type'] || 'jpeg';
            res.type(ctype);
			res.status(200).send(body);
        }else{
			console.info(
				chalk.yellow('头像加载失败，使用默认头像！')
			)
			var data = fs.readFileSync('./data/avatar.png');
			res.type('png');
			res.status(200).send(data);
		}
	});
}