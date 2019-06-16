# 维基萌抽卡系统Node.js版

by 广树 [维基萌](https://www.wikimoe.com/)

使用NodeJs(搭配express-generator+mongoose)+MongoDB+Vue(搭配Vue-cli+Element-ui)

### 介绍

一款通过日常抽卡的卡牌收集游戏。

### 关于更新

如果是更新的话，请注意不要覆盖/server/config/config.json，如果覆盖将会导致配置失效。

### 使用方法

1. 在[releases](https://github.com/eeg1412/wikimoeCardByNodeJS/releases)下载最新版（记得事先安装MongoDB）。
2. `cd server`切换至服务端。
3. `npm install`下载依赖。
4. 确认端口和mongodb地址：server/config/default.js
```javascript
let baseConfig = {
	port: 3000,//网页端口
	url: 'mongodb://localhost:27017/wikimoecard',//mongoDB地址
	sessionSecret:'wikimoe',//session加密字符串（不修改，后面安装时可以修改）
	JWTSecret:'wikimoe',//JWT加密字符串（不修改，后面安装时可以修改）
	dailyChance:5,//每日抽卡次数（不修改，后面安装时可以修改）
	smtpHost: '',//邮件发送host（不修改，后面安装时可以修改）
	smtpPort: 465,//邮件发送端口（不修改，后面安装时可以修改）
	smtpAuth: {
		user: '',//用户名（不修改，后面安装时可以修改）
		pass: ''//密码（不修改，后面安装时可以修改）
	}
}
```
5. `npm start`启动服务器。
6. 进入/cardinstall，对网站进行基本配置。
7. /cardadmin为管理员中心。
