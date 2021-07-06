require('dotenv').config()
require('./mongodb/db');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var history = require('connect-history-api-fallback');

var apiRouter = require('./routes/api');

var app = express();

app.use(logger('dev'));
app.use(express.json({ limit: process.env.JSON_LIMT || '1mb' }));
app.use(express.urlencoded({ extended: false, limit: process.env.URLENCODED_LIMT || '1mb' }));
app.use(cookieParser());

app.use('/api', apiRouter);
app.use(history());
app.use('/', express.static(path.join(__dirname, 'client/dist')));

module.exports = app;
