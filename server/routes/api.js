var express = require('express');
var router = express.Router();
var apiLogin = require('../api/login');
var apiDailycard = require('../api/dailyCard');
var apiReg = require('../api/reg');
var apiSearchCard = require('../api/searchCard');
var apiSearchLog = require('../api/searchLog');
var apiCaptcha = require('../api/captcha');
var apiSendMail = require('../api/sendEMail');


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
router.get('/captcha', apiCaptcha);
router.post('/dailycard', apiDailycard);
router.post('/reg', apiReg);
router.post('/searchcard', apiSearchCard);
router.post('/searchlog', apiSearchLog);
router.post('/sendmail', apiSendMail);
router.post('/login', apiLogin);

module.exports = router;