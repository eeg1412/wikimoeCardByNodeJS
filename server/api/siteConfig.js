module.exports = function(req, res, next){
	let data = 'window.$siteConfig = {"donateImgUrl":"'+global.myAppConfig.donateImgUrl+'","creatCardExplainUrl":"'+global.myAppConfig.creatCardExplainUrl+'","QQunURL":"'+global.myAppConfig.QQunURL+'","courseURL":"'+global.myAppConfig.courseURL+'","browserTitle":"'+global.myAppConfig.browserTitle+'","siteTitle":"'+global.myAppConfig.siteTitle+'"}';
	res.type('js');
	res.status(200).send(data);
}