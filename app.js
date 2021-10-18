var chalk = require('chalk')
console.log('启动中...')
require('dotenv').config()
const configData = require('./config/myAppConfig')
global.DBIsStart = false
// 应用设置
global.myAppConfig = configData()
console.log('已加载配置：')
console.table(global.myAppConfig)
const DBStart = require('./mongodb/db')
var express = require('express')
var session = require('express-session')
var path = require('path')
var cookieParser = require('cookie-parser')
var logger = require('morgan')
var history = require('connect-history-api-fallback')
DBStart()
var apiPublicRouter = require('./routes/public/api')

var app = express()

app.use(logger('dev'))
app.use(express.json({ limit: process.env.JSON_LIMT || '1mb' }))
app.use(
  express.urlencoded({
    extended: false,
    limit: process.env.URLENCODED_LIMT || '1mb',
  })
)
app.use(cookieParser())
app.use(
  session({
    secret: process.env.WIKIMOE_SESSION_SECRET || 'wikimoeCard',
    name: 'wikimoeCard',
    cookie: { maxAge: 60000 },
    resave: false,
    saveUninitialized: true,
  })
)
app.use('/', function (req, res, next) {
  if (global.DBIsStart) {
    next()
  } else {
    console.info(chalk.red('DB启动中，访问被拦截！'))
    res.status(403).send('系统重启中...')
  }
})

app.use('/api/public', apiPublicRouter)
app.use(history())
app.use('/', express.static(path.join(__dirname, 'client/dist')))

module.exports = app
