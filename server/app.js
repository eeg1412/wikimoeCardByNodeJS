var config = require('config-lite')(__dirname);
global.myAppConfig = config;//全局设置变量
global.demining = {
    onlinePlayer: [],
    loaing: true
};
global.onlinePlayer = []
//全局矿场信息
global.MAX_INT32 = 2147483647;
global.MAX_INTJS = 9007199254740991;
var db = require('./mongodb/db');
var express = require('express');
var path = require('path');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var mlogger = require('morgan');
var history = require('connect-history-api-fallback');
var apiRouter = require('./routes/api');
const accessLogger = require("./lib/log/accessLogger");  // ADD
const logger = require("./lib/log/logger").application;
var compression = require('compression')
var app = express();
console.info = (function (oriLogFunc) {
    return function (str) {
        logger.info('app', str.replace(/\\[[0-9][0-9]m/g, ""));
        oriLogFunc.call(console, str);
    }
})(console.info);
console.error = (function (oriLogFunc) {
    return function (str) {
        logger.error('app', str.replace(/\\[[0-9][0-9]m/g, ""));
        oriLogFunc.call(console, str);
    }
})(console.error);
app.use(compression({ filter: shouldCompress }))
function shouldCompress (req, res) {
    if (req.headers['x-no-compression']) {
        // 这里就过滤掉了请求头包含'x-no-compression'
        return false
    }

    return compression.filter(req, res)
}
app.use(mlogger('dev'));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: false, limit: '1mb' }));
app.use(cookieParser());
app.use(session({
    secret: global.myAppConfig.sessionSecret,
    name: 'wikimoe',
    cookie: { maxAge: 60000 },
    resave: false,
    saveUninitialized: true,
}));

app.use(accessLogger());
app.use('/api', apiRouter)
app.use(history());
app.use('/', express.static(path.join(__dirname, 'public')));
module.exports = app;
