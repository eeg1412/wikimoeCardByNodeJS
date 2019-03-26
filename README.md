# 维基萌抽卡系统Node.js版

by 广树 [维基萌](https://www.wikimoe.com/)

使用NodeJs(搭配express-generator+mongoose)+MongoDB+Vue(搭配Vue-cli+Element-ui)
###介绍

一款通过日常抽卡的卡牌收集游戏。

###使用方法

1. 将项目克隆下来（记得事先安装MongoDB）。
2. `cd server`切换至服务端。
3. `npm install`下载依赖。
4. 编辑配置文件：server/config/default.js
```javascript
module.exports = {
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
```
5. `npm start`启动服务器。
