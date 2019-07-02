var config = require('config-lite')(__dirname);
global.myAppConfig = config;//全局设置变量
var db = require('./mongodb/db');
var express = require('express');
var path = require('path');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var history = require('connect-history-api-fallback');
var apiRouter = require('./routes/api');
var app = express();

app.use(logger('dev'));
app.use(express.json({limit: '1mb'}));
app.use(express.urlencoded({ extended: false,limit: '1mb' }));
app.use(cookieParser());
app.use(session({
    secret: global.myAppConfig.sessionSecret,
    name: 'wikimoe',
    cookie: {maxAge: 60000},
    resave: false,
    saveUninitialized: true,
}));
    
app.use('/api', apiRouter);
app.use(history());
app.use('/',express.static(path.join(__dirname, 'public')));
module.exports = app;
