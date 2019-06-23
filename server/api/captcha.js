var svgCaptcha = require('svg-captcha');
var utils = require('../utils/utils');

module.exports = function(req, res, next){
	let noiseRadom = utils.randomNum(3,5);
    var captcha = svgCaptcha.createMathExpr({noise:noiseRadom,color:false});
	req.session.captcha = captcha.text;
	res.type('svg');
	res.status(200).send(captcha.data);
}