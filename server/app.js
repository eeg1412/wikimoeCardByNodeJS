var db = require('./mongodb/db');
var express = require('express');
var path = require('path');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var history = require('connect-history-api-fallback');
var config = require('config-lite')(__dirname);

var apiRouter = require('./routes/api');
var app = express();
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
    secret: config.sessionSecret,
    name: 'wikimoe',
    cookie: {maxAge: 60000},
    resave: false,
    saveUninitialized: true,
}));
    
app.use('/api', apiRouter);
app.use(history());
app.use('/',express.static(path.join(__dirname, 'public')));
module.exports = app;
