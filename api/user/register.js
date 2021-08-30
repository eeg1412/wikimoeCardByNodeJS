const utils = require('@utils')
const chalk = require('chalk')
const jwt = require('jsonwebtoken')
const md5 = require("md5");

const userData = require('@mongoUtils/user/user.js')
const battleInfosData = require('@mongoUtils/user/battleInfos.js')
const daliyGetItemInfosData = require('@mongoUtils/user/daliyGetItemInfos.js')
const deminingInfosData = require('@mongoUtils/user/deminingInfos.js')
const guessCardInfosData = require('@mongoUtils/user/guessCardInfos.js')
const itemInfosData = require('@mongoUtils/user/itemInfo.js')
const statisticsData = require('@mongoUtils/user/statistics.js')
const userCardsData = require('@mongoUtils/user/userCard.js')

module.exports = async function (req, res, next) {
  let IP = utils.getUserIp(req)
  const account = req.body.account.toLowerCase() || ''
  const nickName = req.body.nickName || ''
  const password = req.body.password || ''
  const captcha = req.body.captcha || ''
  console.info(chalk.green(account + '提交了一次注册！IP为：' + IP))
  // 校验验证码
  if (req.session.captcha != captcha || !captcha) {
    req.session.destroy((err) => {
      if (err) {
        console.info(chalk.red(IP + '验证码清理失败' + '，' + err))
      }
    })
    res.send({
      code: 0,
      msg: '验证码有误！',
    })
    return false
  }
  // 校验账号
  if (!utils.accountCheck(account)) {
    res.send({
      code: 0,
      msg: '账号只能允许2-16位英数字下划线减号！',
    })
    console.info(chalk.yellow(req.body.account + '账号格式有误！IP为：' + IP))
    return false
  }
  // 校验昵称
  if (!utils.nickNameCheck(nickName)) {
    res.send({
      code: 0,
      msg: '昵称只能允许为2-8位中英日数字与下划线！',
    })
    console.info(chalk.yellow(req.body.account + '昵称格式有误！IP为：' + IP))
    return false
  }
  // 校验密码
  if (!utils.passwordCheck(password)) {
    res.send({
      code: 0,
      msg: '密码必须为4-16位英数字符号',
    })
    console.info(chalk.yellow(req.body.account + '密码格式有误！IP为：' + IP))
    return false
  }
  // 是否存在账号
  let params = {
    account: account,
  }
  let result = await userData.findOne(params).catch((err) => {
    res.send({
      code: 0,
      msg: '内部错误请联系管理员！',
    })
    console.error(chalk.red('数据库查询错误！'))
    throw err
  })

  if (result) {
    res.send({
      code: 0,
      msg: '该账号已注册！',
    })
    console.info(chalk.yellow(account + '账号已注册，注册失败！IP为：' + IP))
    return false
  }

  // 是否存在昵称
  let params2 = {
    nickName: nickName,
  }
  let result2 = await userData.findOne(params2).catch((err) => {
    res.send({
      code: 0,
      msg: '内部错误请联系管理员！',
    })
    console.error(chalk.red('数据库查询错误！'))
    throw err
  })

  if (result2) {
    res.send({
      code: 0,
      msg: '该昵称已注册！',
    })
    console.info(chalk.yellow(nickName + '昵称已注册，注册失败！IP为：' + IP))
    return false
  }

  // 创建各种信息
  // 1.对战
  const newUserbattleInfosData = await battleInfosData.save({}).catch((err) => {
    res.send({
      code: 0,
      msg: '内部错误请联系管理员！',
    })
    console.error(chalk.red('数据库查询错误！'))
    throw err
  })
  // 2.日常任务
  const newUserDaliyGetItemData = await daliyGetItemInfosData.save({}).catch((err) => {
    res.send({
      code: 0,
      msg: '内部错误请联系管理员！',
    })
    console.error(chalk.red('数据库查询错误！'))
    throw err
  })
  // 3.挖矿
  const newUserDeminingInfoData = await deminingInfosData.save({}).catch((err) => {
    res.send({
      code: 0,
      msg: '内部错误请联系管理员！',
    })
    console.error(chalk.red('数据库查询错误！'))
    throw err
  })
  // 4.猜卡
  const newUserGuessCardInfoData = await guessCardInfosData.save({}).catch((err) => {
    res.send({
      code: 0,
      msg: '内部错误请联系管理员！',
    })
    console.error(chalk.red('数据库查询错误！'))
    throw err
  })
  // 5.道具
  const newUserItemData = await itemInfosData.save({}).catch((err) => {
    res.send({
      code: 0,
      msg: '内部错误请联系管理员！',
    })
    console.error(chalk.red('数据库查询错误！'))
    throw err
  })
  // 6.统计
  const newUserStatisticsData = await statisticsData.save({}).catch((err) => {
    res.send({
      code: 0,
      msg: '内部错误请联系管理员！',
    })
    console.error(chalk.red('数据库查询错误！'))
    throw err
  })
  // 7.用户卡牌
  const newUserCardData = await userCardsData.save({}).catch((err) => {
    res.send({
      code: 0,
      msg: '内部错误请联系管理员！',
    })
    console.error(chalk.red('数据库查询错误！'))
    throw err
  })

  // 写入用户数据
  var creatAccountData = {
    account: account,
    nickName: nickName,
    password: md5(password),
    star: 0,
    ip: IP,
    battleInfo: newUserbattleInfosData._id,
    deminingInfo: newUserDeminingInfoData._id,
    guessCardInfo: newUserGuessCardInfoData._id,
    itemInfo: newUserItemData._id,
    daliyGetItemInfo: newUserDaliyGetItemData._id,
    statistics: newUserStatisticsData._id,
    userCard: newUserCardData._id,
  }
  let content = { account: account } // 要生成token的主题信息
  let secretOrPrivateKey = process.env.JWT_SECRET_KEY || 'wikimoeCard' // 这是加密的key（密钥）
  let remTime = 60 * 60 * 24 //24小时失效
  let token = jwt.sign(content, secretOrPrivateKey, {
    expiresIn: remTime,
  })
  creatAccountData['token'] = token
  await userData.save(creatAccountData).catch((err) => {
    res.send({
      code: 0,
      msg: '内部错误请联系管理员！',
    })
    console.error(chalk.red('数据库查询错误！'))
    throw err
  })
  // 写入记录
  // let logObject = {
  //   email: email,
  //   md5: md5(email),
  //   nickName: nickName,
  //   type: 'register',
  //   data: {},
  //   ip: IP,
  // }
  // utils.writeLog(logObject)
  res.send({
    code: 1,
    token: token,
    msg: '注册成功！',
  })
  console.info(chalk.green(account + '，注册成功。IP为：' + IP))
}
