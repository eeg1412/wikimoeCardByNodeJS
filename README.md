# 维基萌抽卡系统Node.js版

by 广树 [维基萌](https://www.wikimoe.com/)

使用NodeJs(搭配express-generator+mongoose)+MongoDB+Vue(搭配Vue-cli+Element-ui)

### 介绍

一款由玩家DIY卡牌的卡牌收集游戏。

### 特色系统

- [x] 日常抽卡
- [x] 每日签到
- [x] 矿场挖矿
- [x] 组建卡牌
- [x] 排位对战
- [x] 卡牌升级
- [x] 等级转换
- [x] 商店抽卡
- [x] 卡牌自由交易市场
- [x] 卡牌分解
- [x] 卡牌图鉴鉴赏
- [x] 玩家DIY自制卡牌
- [x] Live2D游戏向导

### 关于更新

如果是更新的话，请注意不要覆盖/server/config/config.json，如果覆盖将会导致配置失效。
1.x不兼容0.x的数据库！

### 使用方法

1. 在[releases](https://github.com/eeg1412/wikimoeCardByNodeJS/releases)下载最新版（记得事先安装MongoDB）。
2. `cd server`切换至服务端。
3. `npm install`下载依赖。
4. 确认端口和mongodb地址：server/config/default.js
```javascript
let baseConfig = {
	port: 3000,//网页端口
	https:false,//是否开启https,
	sslPort:667,//https端口
	site:'https://127.0.0.1:667',//站点域名
	keyFileSrc:'./bin/nodejs.wikimoe.com-key.pem',//私钥文件路径
	certFileSrc:'./bin/nodejs.wikimoe.com-chain.pem',//证书文件路径
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
6. 进入/cardinstall，对网站进行基本配置。
7. /cardadmin为管理员中心。
