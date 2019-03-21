'use strict';

module.exports = {
	port: 3000,//网页端口
	url: 'mongodb://localhost:27017/wikimoecard',//mongoDB地址
	sessionSecret:'wikimoe',//session加密字符串
	JWTSecret:'wikimoe',//JWT加密字符串
	smtpHost: '',//邮件发送host
	smtpPort: 465,//邮件发送端口
	smtpAuth: {
		user: '',//自己的邮箱地址
		pass: ''//密码
	}
}