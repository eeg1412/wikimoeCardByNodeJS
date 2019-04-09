const fs = require('fs');
function configData(){
	let baseConfig = {
		port: 3000,//网页端口
		url: 'mongodb://localhost:27017/wikimoecard',//mongoDB地址
		sessionSecret:'wikimoe',//session加密字符串
		JWTSecret:'wikimoe',//JWT加密字符串
		dailyChance:5,//每日抽卡次数
		smtpHost: '',//邮件发送host
		smtpPort: 465,//邮件发送端口
		smtpAuth: {
			user: '',//用户名
			pass: ''//密码
		}
	}
	let myConfig = fs.readFileSync('./config/config.json', 'utf8');
	myConfig = JSON.parse(myConfig);
	return Object.assign(baseConfig, myConfig);
}
module.exports = configData()