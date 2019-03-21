var svgCaptcha = require('svg-captcha');
module.exports = function(req, res, next){
    var captcha = svgCaptcha.createMathExpr();
	req.session.captcha = captcha.text;
	res.type('svg');
	res.status(200).send(captcha.data);
}