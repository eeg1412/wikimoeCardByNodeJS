var express = require('express');
var router = express.Router();

var apiReg = require('../api/user/register');
const apiCaptcha = require("../api/captcha");
var apiLogin = require('../api/login');

// post
router.post('/register', apiReg);
router.post('/login', apiLogin);
router.get("/captcha", apiCaptcha);

module.exports = router;
