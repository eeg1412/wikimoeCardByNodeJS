const utils = require('../utils/utils')
const userData = require('../utils/database/user')
const itemDatabase = require('../utils/database/item')
const chalk = require('chalk')

module.exports = async function (req, res, next) {
  const IP = utils.getUserIp(req)
  const token = req.body.token
  const captcha = req.body.captcha
  //解析token
  if (!token) {
    res.send({
      code: 403,
      msg: 'token为空！',
    })
    return false
  }
  let result = await utils.tokenCheckAndEmail(token).catch((err) => {
    throw err
  })
  if (!result) {
    res.send({
      code: 403,
      msg: '账户信息已失效，请重新登录！',
    })
    console.info(chalk.yellow('查询结果无该用户,IP为：' + IP))
    return false
  }
  let email = result.email
  if (!result.robotCheck) {
    res.send({
      code: 0,
      msg: '当前无需验证！',
    })
    console.info(
      chalk.yellow('无需进行机器人验证,IP为：' + IP + '，邮箱为：' + email)
    )
    return false
  }
  console.info(chalk.green(IP + '的邮箱解析结果为' + email))
  // 验证码验证
  if (req.session.captcha != captcha || !captcha) {
    await req.session.destroy((err) => {
      if (err) {
        console.info(chalk.red(IP + '验证码清理失败' + '，' + err))
      }
    })
    // 验证码检测失败增加可疑值
    let robot = result.robotRate + 10
    if (robot === 500000) {
      robot = 500000
    }
    const params = {
      robotRate: robot,
      ip: IP,
    }
    await userData.updataUser({ email: email }, params).catch((err) => {
      res.send({
        code: 0,
        msg: '内部错误请联系管理员！',
      })
      console.error(chalk.red('数据库更新错误！'))
      throw err
    })
    res.send({
      code: 0,
      msg: '验证码有误，或者已经过期！',
    })
    console.info(chalk.yellow('图形验证码有误。IP为：' + IP))
    return false
  }
  // 验证通过减少可疑值
  const timeNow = Math.round(new Date().getTime() / 1000)
  const userTime = Number(result.robotCheckTime)
  let timeCha = 0
  // 每2分钟减少可疑度的减少
  if (userTime !== 0) {
    timeCha = Math.floor((timeNow - userTime) / 120)
  }
  if (timeCha > 48) {
    timeCha = 48
  }
  let robot = result.robotRate - (12 - timeCha)
  let getStar = 0
  if (robot < 0) {
    robot = 0
  }
  let setRobotRate = result.setRobotRate
  if (
    robot + setRobotRate < global.myAppConfig.robotCheckCanGetStar &&
    timeCha === 0
  ) {
    getStar = global.myAppConfig.robotCheckStar
  }
  /*
    $inc: {
      star: getStar,
    },
    getStar 改为获得神秘碎片
  */
  const params = {
    robotRate: robot,
    robotCheck: false,
    ip: IP,
  }
  await userData.updataUser({ email: email }, params).catch((err) => {
    res.send({
      code: 0,
      msg: '内部错误请联系管理员！',
    })
    console.error(chalk.red('数据库更新错误！'))
    throw err
  })
  const itemParams = {
    $inc: {
      'item.501': getStar,
    },
  }
  await itemDatabase
    .findOneAndUpdate({ email: email }, itemParams)
    .catch((err) => {
      console.error(chalk.red('数据库更新错误！'))
      throw err
    })
  await req.session.destroy((err) => {
    if (err) {
      console.info(chalk.red(IP + '验证码清理失败' + '，' + err))
    }
  })
  res.send({
    code: 1,
    msg: '验证通过！',
    getStar: getStar,
  })
}
