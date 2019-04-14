var express = require('express');
var router = express.Router();
var apiLogin = require('../api/login');
var apiDailycard = require('../api/dailyCard');
var apiReg = require('../api/reg');
var apiFind = require('../api/find');
var apiSearchCard = require('../api/searchCard');
var apiSearchLog = require('../api/searchLog');
var apiCaptcha = require('../api/captcha');
var apiSendMail = require('../api/sendEMail');
var apiUserInfo = require('../api/userInfo');
var apiShop = require('../api/shop');

var adminApiCheckInstall = require('../api/admin/install/checkInstall');
var adminApiInstall = require('../api/admin/install/install');
var adminApiLoging = require('../api/admin/login');
var adminApiSetting = require('../api/admin/setting');
var adminApiGiveStar = require('../api/admin/givestar');
var adminApiSearchUser = require('../api/admin/searchUser');


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
router.get('/captcha', apiCaptcha);
router.post('/dailycard', apiDailycard);
router.post('/reg', apiReg);
router.post('/find', apiFind);
router.post('/searchcard', apiSearchCard);
router.post('/searchlog', apiSearchLog);
router.post('/sendmail', apiSendMail);
router.post('/login', apiLogin);
router.post('/userinfo', apiUserInfo);
router.post('/shop', apiShop);

router.get('/admin/checkinstall', adminApiCheckInstall);
router.post('/admin/install', adminApiInstall);
router.post('/admin/login', adminApiLoging);
router.post('/admin/setting', adminApiSetting);
router.post('/admin/givestar', adminApiGiveStar);
router.post('/admin/searchuser', adminApiSearchUser);

module.exports = router;