var express = require('express');
var router = express.Router();
var apiLogin = require('../api/login');
var apiDailycard = require('../api/dailyCard');
var apiReg = require('../api/reg');
var apiSearchCard = require('../api/searchCard');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
router.post('/dailycard', apiDailycard);
router.post('/reg', apiReg);
router.post('/searchcard', apiSearchCard);
// router.post('/login', apiLogin.login);

module.exports = router;