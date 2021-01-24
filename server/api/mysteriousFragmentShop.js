const utils = require('../utils/utils')
const itemDatabase = require('../utils/database/item')
const chalk = require('chalk')
const mysteriousFragmentShop = require('../data/mysteriousFragmentShop.json')
module.exports = async function (req, res, next) {
  const IP = utils.getUserIp(req)
  const token = req.body.token
  const itemId = req.body.itemId
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
  console.info(chalk.green(IP + '的邮箱解析结果为' + email))
  //   查询是否有该兑换信息
  const mysteriousFragmentShopInfo = mysteriousFragmentShop.find((item) => {
    return item.id === itemId
  })
  if (!mysteriousFragmentShopInfo) {
    res.send({
      code: 0,
      msg: '不存在该兑换信息！',
    })
    return false
  }
  //   如果有信息
  const price = mysteriousFragmentShopInfo.price
  const get = mysteriousFragmentShopInfo.get
  //   查询用户道具信息
  const userItemDataBaseInfo =
    (await itemDatabase.findOne({ email: email }).catch((err) => {
      res.send({
        code: 0,
        msg: '内部错误请联系管理员！',
      })
      console.error(chalk.red('数据库错误！'))
      throw err
    })) || {}
  const userItemData = userItemDataBaseInfo['item'] || {} //获取道具信息
  const myItemNum501 = userItemData['501'] || 0
  const getItemData = userItemData[itemId] || 0
  //   判断神秘碎片是否够
  if (myItemNum501 < price) {
    res.send({
      code: 0,
      msg: '神秘碎片不足！',
    })
    return false
  }
  //   神秘碎片够
  const itemParams = {
    'item.501': myItemNum501 - price,
  }
  itemParams['item.' + itemId] = getItemData + get
  await itemDatabase
    .findOneAndUpdate({ email: email }, itemParams)
    .catch((err) => {
      console.error(chalk.red('数据库更新错误！'))
      throw err
    })
  // 重新获取道具信息
  const userItemDataBaseInfoNew =
    (await itemDatabase.findOne({ email: email }).catch((err) => {
      res.send({
        code: 0,
        msg: '内部错误请联系管理员！',
      })
      console.error(chalk.red('数据库错误！'))
      throw err
    })) || {}
  const userItemDataNew = userItemDataBaseInfoNew['item'] || {} //获取道具信息
  res.send({
    code: 1,
    msg: '兑换成功！',
    item: userItemDataNew,
  })
}
