const fs = require('fs');
function configData () {
	let baseConfig = {
		port: 3000,//网页端口
		https: false,//是否开启https,
		sslPort: 667,//https端口
		site: 'https://127.0.0.1:667',//站点域名
		keyFileSrc: './bin/nodejs.wikimoe.com-key.pem',//私钥文件路径
		certFileSrc: './bin/nodejs.wikimoe.com-chain.pem',//证书文件路径
		url: 'mongodb://localhost:27017/wikimoecardV3',//mongoDB地址
		sessionSecret: 'wikimoe',//session加密字符串
		JWTSecret: 'wikimoe',//JWT加密字符串
		dailyChance: 5,//每日抽卡次数
		smtpHost: '',//邮件发送host
		smtpPort: 465,//邮件发送端口
		smtpAuth: {
			user: '',//用户名
			pass: ''//密码
		},
		robotCheckStar: 25,//机器人验证通过后送的星星
		robotCheckCanGetStar: 25,//机器人可疑度低于这个值送星星
		deminingStarRatio: 1,//挖矿获得星星的倍率
		deminingItemRatio: 1,//挖矿获得宝石的倍率
		creatCardStar: 100,//制卡审核通过后获得的星星
		creatCardWait: 20,//单用户最多等待审核的制卡
		useMarketCardCount: 30,//集齐多少种卡牌后能在市场交易
		battleRankGetItem: 100,//竞技第一名额外获得五円玉的数量
		battleRankGetItemDecay: 10,//后面陆续获得五円玉的衰减数量
		donateImgUrl: '',//捐赠图片URL地址
		creatCardExplainUrl: '',//制卡说明图片URL地址
		QQunURL: '',//加群链接
		courseURL: '',//教程链接
		browserTitle: '维基萌抽卡',//浏览器标签标题
		siteTitle: '维基萌抽卡',//网站标题

	}
	let myConfig = fs.readFileSync('./config/config.json', 'utf8');
	myConfig = JSON.parse(myConfig);
	return Object.assign(baseConfig, myConfig);
}
module.exports = configData()