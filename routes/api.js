var express = require('express');
var router = express.Router();

var apiReg = require('../api/register');
var apiLogin = require('../api/login');

// post
router.post('/register', apiReg);
router.post('/login', apiLogin);

module.exports = router;
