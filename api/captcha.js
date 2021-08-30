var svgCaptcha = require("svg-captcha");

module.exports = function (req, res, next) {
  const noiseRadom = 5;
  const captcha = svgCaptcha.createMathExpr({
    noise: noiseRadom,
    color: false
  });
  req.session.captcha = captcha.text;
  res.type("svg");
  res.status(200).send(captcha.data);
};
