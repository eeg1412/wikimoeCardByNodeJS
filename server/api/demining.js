var utils = require('../utils/utils')
var deminingModel = require('../models/demining')
var md5 = require('md5-node')
var userData = require('../utils/database/user')
var itemDatabase = require('../utils/database/item')
var chalk = require('chalk')
var mapData = require('../data/deminingMap.json')
const validator = require('validator')
const _ = require('lodash')

var mineSweepingMap = function (returnData) {
  //20,30
  let randomRowsCols = utils.randomNum(20, 25)
  let r = randomRowsCols
  let c = randomRowsCols
  //40,80
  let num = utils.randomNum(40, 80)
  var map = []
  // 给行数，生成一个 1 维数组
  var row = function (r) {
    for (var i = 0; i < r; i++) {
      map[i] = new Array()
    }
  }
  // 给列数，生成一个 2 维数组
  var column = function (col) {
    for (var i = 0; i < map.length; i++) {
      for (var j = 0; j < col; j++) {
        map[i][j] = 0
      }
    }
  }
  // 给列数和行数生成空地图
  var blankMap = function (r, col) {
    row(r)
    column(col)
  }

  // 给出地雷数量让后随机写入地雷
  var writeInMine = function (num) {
    // 随机位置写入
    var randomLocation = function () {
      var x = Math.floor(Math.random() * r)
      var y = Math.floor(Math.random() * c)
      // console.log( ':', x, y);
      if (map[x][y] !== 9) {
        map[x][y] = 9
      } else {
        randomLocation()
      }
    }
    for (var i = 0; i < num; i++) {
      randomLocation()
    }
  }

  // 使用循环给雷的边上所有数 +1 , 已经是雷的除外
  var plus = function (array, x, y) {
    if (x >= 0 && x < r && y >= 0 && y < c) {
      if (array[x][y] !== 9) {
        array[x][y] += 1
      }
    }
  }
  var writeInHint = function () {
    for (var x = 0; x < map.length; x++) {
      for (var y = 0; y < map[0].length; y++) {
        if (map[x][y] === 9) {
          // 上下 6 个
          for (var i = -1; i < 2; i++) {
            plus(map, x - 1, y + i)
            plus(map, x + 1, y + i)
          }
          // 左右 2 个
          plus(map, x, y + 1)
          plus(map, x, y - 1)
        }
      }
    }
  }

  blankMap(r, c)
  writeInMine(num)
  writeInHint()
  let time = Math.round(new Date().getTime() / 1000)
  let randomMapType = utils.randomNum(1, 17)
  let data = {
    map: map,
    creatTime: time,
    mapType: randomMapType,
    boomNum: num,
    boomedNum: 0,
    rows: r,
    cols: c,
    player: null,
    close: 0,
  }
  // document作成
  var demining = new deminingModel(data)

  // document保存
  demining.save(function (err) {
    if (err) throw err
  })
  if (returnData) {
    delete data.boomedNum
    delete data.boomNum
    delete data.map
    // console.log(data);
    return data
  }
}

var getMineMap = function (socket, cast) {
  deminingModel.findOne(
    { close: 0 },
    '-_id creatTime mapType rows cols player close',
    (err, result) => {
      if (err) {
        socket.emit('demining', { code: 1, msg: '内部错误请联系管理员！' })
        throw err
      } else {
        //判断是否有数据
        if (result) {
          let resData = {
            data: result,
            code: 0,
          }
          socket.emit('demining', resData)
          // if(cast){
          //     socket.broadcast.emit('demining',resData);
          // }
        } else {
          let mineData = mineSweepingMap(true)
          let resData = {
            data: mineData,
            code: 0,
          }
          socket.emit('demining', resData)
          if (cast) {
            socket.broadcast.emit('demining', resData)
          }
        }
      }
    }
  )
}
const openNode = async (socket, data, result_) => {
  await deminingModel.findOne({ close: 0 }, async (err, result) => {
    if (err) {
      socket.emit('demining', { code: 1, msg: '内部错误请联系管理员！' })
      throw err
    } else {
      //判断是否有数据
      if (result) {
        let x = Math.round(data.x) || 0
        let y = Math.round(data.y) || 0
        if (result.player) {
          // 判断是否被人挖
          if (result.player[y + '_' + x]) {
            socket.emit('demining', {
              code: 1,
              msg: '此处已经被人抢先！',
              time: data.time,
            })
            return false
          }
        }
        // 判断矿场时间戳是否对的上
        if (result.creatTime != data.creatTime) {
          socket.emit('demining', {
            code: 1,
            msg: '矿场不正确，请刷新查看！',
            time: data.time,
          })
          console.info(chalk.yellow('错误的矿场时间戳'))
          return false
        }
        // let playData = result.player;
        let demNum = null
        try {
          demNum = result.map[y][x]
        } catch (err) {
          socket.emit('demining', {
            code: 1,
            msg: '矿场不正确，请刷新查看！',
            time: data.time,
          })
          console.info(chalk.yellow('矿场x,y有误！'))
          return false
        }
        let boomedNum = result.boomedNum
        let boomNum = result.boomNum
        let close = result.close
        let starAdd = 0
        let useTool = data.tool
        let getItem = null
        let getItemNum = 0
        let playData = null
        if (demNum === undefined || demNum === null) {
          socket.emit('demining', {
            code: 1,
            msg: '矿场不正确，请刷新查看！',
            time: data.time,
          })
          console.info(chalk.yellow('错误的矿场坐标'))
          return false
        }
        if (playData === null) {
          playData = {}
        }
        const centerInfo = {
          demNum: demNum,
          x: x,
          y: y,
        }
        const doDemRes = await this.doDemining(
          result,
          useTool,
          centerInfo,
          result_,
          data,
          socket
        )

        if (!doDemRes.status) {
          socket.emit('demining', {
            code: 1,
            msg: '矿场请求出错，请联系管理员！',
            time: data.time,
          })
          return false
        }

        close = doDemRes.close
        const levelUpStar = doDemRes.levelUpStar
        const getExp = doDemRes.getExp
        boomedNum = doDemRes.boomedNum
        starAdd = doDemRes.starAdd
        getItem = doDemRes.getItem
        getItemNum = doDemRes.getItemNum
        playData = doDemRes.playData
        openInfoList = doDemRes.openInfoList
        let md5Email = md5(data.email)

        console.info(
          chalk.green(
            data.email +
              '用工具' +
              useTool +
              '挖掘了[' +
              x +
              ',' +
              y +
              ']，其结果为：' +
              demNum +
              '，共获得星星' +
              starAdd +
              '颗，' +
              'IP为：' +
              data.IP
          )
        )

        deminingModel.updateOne(
          { close: 0, __v: result['__v'] },
          {
            player: playData,
            boomedNum: boomedNum,
            close: close,
            $inc: { __v: 1 },
          },
          async (err, docs) => {
            // console.log(docs);
            if (err) {
              socket.emit('demining', {
                code: 1,
                msg: '内部错误请联系管理员！',
                time: data.time,
              })
              throw err
            } else if (docs.nModified === 0) {
              socket.emit('demining', {
                code: 1,
                msg: '哎呀，挖掘失败了！',
                time: data.time,
              })
            } else {
              if (doDemRes.userParams) {
                // 如果有用户数据
                let filters = {
                  email: data.email,
                }

                await userData
                  .updataUser(filters, doDemRes.userParams)
                  .catch((err) => {
                    socket.emit('demining', {
                      code: 1,
                      msg: '内部错误请联系管理员！',
                      time: data.time,
                    })
                    console.error(chalk.red('数据库更新错误！'))
                    throw err
                  })
              }

              if (doDemRes.itemUpdate) {
                //如果有挖到道具数据
                let conditions = {
                  email: data.email,
                }
                await itemDatabase
                  .findOneAndUpdate(conditions, doDemRes.itemUpdate)
                  .catch((err) => {
                    socket.emit('demining', {
                      code: 1,
                      msg: '内部错误请联系管理员！',
                      time: data.time,
                    })
                    console.error(chalk.red('数据库更新错误！'))
                    throw err
                  })
              }
              if (starAdd > 0) {
                socket.emit('demining', {
                  code: 2,
                  star: starAdd,
                  demNum: demNum,
                  time: data.time,
                  x: x,
                  y: y,
                  md5: md5Email,
                  close: close,
                  levelUpStar: levelUpStar,
                })
                const timeNow = Math.round(new Date().getTime() / 1000)
                let logObject = {
                  email: data.email,
                  md5: md5Email,
                  nickName: result_.nickName,
                  type: 'demining',
                  time: timeNow,
                  data: {
                    star: starAdd,
                    pickaxe: useTool,
                    exp: getExp,
                    x: x,
                    y: y,
                  },
                  ip: data.IP,
                }
                utils.writeLog(logObject)
              } else {
                if (useTool < 5) {
                  socket.emit('demining', {
                    code: 201,
                    demNum: demNum,
                    time: data.time,
                    x: x,
                    y: y,
                    md5: md5Email,
                    levelUpStar: levelUpStar,
                    getItem: getItem,
                    getItemNum: getItemNum,
                  })
                } else {
                  socket.emit('demining', {
                    code: 205,
                    openInfoList: openInfoList,
                    time: data.time,
                    levelUpStar: levelUpStar,
                    boomItemList: doDemRes.boomItemList,
                  })
                }
              }
              // 广播挖矿信息
              if (close) {
                deminingModel.deleteMany({ close: 1 }, (err) => {
                  if (err) {
                    socket.emit('demining', {
                      code: 1,
                      msg: '内部错误请联系管理员！',
                      time: data.time,
                    })
                    console.error(chalk.red('数据库更新错误！'))
                    console.error(chalk.red(err))
                  }
                  console.info(chalk.green('删除已关闭矿场'))
                })
                getMineMap(socket, true)
              } else {
                if (useTool < 5) {
                  socket.broadcast.emit('demining', {
                    code: 5,
                    demNum: demNum,
                    x: x,
                    y: y,
                    md5: md5Email,
                  })
                } else {
                  for (let i = 0; i < openInfoList.length; i++) {
                    socket.broadcast.emit('demining', {
                      code: 5,
                      demNum: openInfoList[i].num,
                      x: openInfoList[i].x,
                      y: openInfoList[i].y,
                      md5: openInfoList[i].md5,
                    })
                  }
                  socket.broadcast.emit('demining', { code: 6 })
                }
              }
            }
          }
        )
      } else {
        socket.emit('demining', {
          code: 1,
          msg: '内部错误请联系管理员！',
          time: data.time,
        })
      }
    }
  })
}
var sendUserData = function (socket, userData) {
  socket.emit('demining', {
    code: 3,
    msg: 'ok',
    userData: userData,
  })
}
exports.doDemining = async (
  demInfo,
  useTool,
  centerInfo,
  userInfo,
  socketData,
  socket
) => {
  let sendData = {
    status: false,
    userParams: null,
    itemUpdate: null,
    openInfoList: [],
  }
  const result = demInfo //矿场数据
  const result_ = userInfo //用户数据
  const demNum = centerInfo.demNum //挖到的数字
  const data = socketData //socket数据
  let boomedNum = result.boomedNum //已挖开的星星矿
  let boomNum = result.boomNum //一共有多少星星矿
  let starAdd = 0 //用户增加的星星
  let playData = demInfo.player //矿场用户数据
  let getItemNum = 0 //获得道具数量
  let getItem = null //获得道具
  let close = result.close //矿场是否关闭
  let deminingTool = result_.deminingStamp //0-2号稿子冷却时间
  let userItemTools = data.userItemTools //3-5号稿子数量
  let getExp = 0 //获得经验
  let levelUpStar = 0
  let timeNow = Math.round(new Date().getTime() / 1000)
  if (useTool < 3) {
    // 普通镐
    if (playData === null) {
      playData = {}
    }
    playData[centerInfo.y + '_' + centerInfo.x] = {
      md5: md5(data.email),
      num: demNum,
    }
    sendData.openInfoList.push({
      md5: md5(data.email),
      num: demNum,
    })
    if (demNum == 9) {
      // 挖到矿了！
      boomedNum = boomedNum + 1
      if (useTool == 0) {
        starAdd = utils.randomNum(1, 4)
      } else if (useTool == 1) {
        starAdd = utils.randomNum(5, 15)
      } else if (useTool == 2) {
        starAdd = utils.randomNum(20, 30)
      }
      // 乘以后台设定的星星系数
      starAdd = starAdd * global.myAppConfig.deminingStarRatio
    } else {
      let itemRare = utils.randomNum(1, 100) //随机一个随机道具因子
      let mapType = result.mapType
      if (itemRare >= 80) {
        //20%概率地图稀有道具
        let itemList = mapData[mapType].low
        getItem = itemList[utils.randomNum(0, itemList.length - 1)]
      } else {
        //80%概率地图常见道具
        let itemList = mapData[mapType].high
        getItem = itemList[utils.randomNum(0, itemList.length - 1)]
      }
      getItemNum = demNum + 1 //获得道具数量
      //根据不同的镐 增加获取数量
      if (useTool == 1) {
        getItemNum = getItemNum * 3
      } else if (useTool == 2) {
        getItemNum = getItemNum * 6
      }
      // 乘以后台的系数
      getItemNum = getItemNum * global.myAppConfig.deminingItemRatio
    }
    if (boomedNum >= boomNum) {
      close = 1
    }
    if (demNum == 9 && close === 1) {
      //如果是最后一矿且挖到矿了*3的矿
      starAdd = starAdd * 3
      console.info(
        chalk.green('当前为最后一片矿，三倍出矿，总出矿：' + starAdd)
      )
    }
    let addToolTime = 0
    if (useTool == 0) {
      addToolTime = 60 * 10
    } else if (useTool == 1) {
      addToolTime = 60 * 30
    } else if (useTool == 2) {
      addToolTime = 60 * 60
    } else {
      console.info(chalk.yellow('使用错误的稿子参数'))
      return sendData
    }
    // 生成用户数据
    deminingTool[useTool] = timeNow + addToolTime
    let levle = result_.level
    getExp = 10 + demNum + starAdd
    let exp = result_.exp + getExp
    let levelExp = utils.levelCheck(levle, exp)
    levelUpStar = levelExp[2] * 30
    let params = {
      $inc: {
        star: starAdd + levelUpStar,
        deminingStarCount: starAdd,
      },
      deminingStamp: deminingTool,
      level: levelExp[0],
      exp: levelExp[1],
      captchaLock: false,
      ip: data.IP,
    }
    sendData['userParams'] = params
    sendData['levelUpStar'] = levelUpStar
    sendData['getExp'] = getExp
    if (demNum < 9) {
      // 生成道具数据
      let getItemObj = {}
      getItemObj['item.' + getItem] = getItemNum
      let update_ = {
        $inc: getItemObj,
      }
      sendData['itemUpdate'] = update_
      sendData['getItem'] = getItem
      sendData['getItemNum'] = getItemNum
    }
  } else if (useTool === 3) {
    // 星星镐
    if (playData === null) {
      playData = {}
    }
    playData[centerInfo.y + '_' + centerInfo.x] = {
      md5: md5(data.email),
      num: demNum,
    }
    sendData.openInfoList.push({
      md5: md5(data.email),
      num: demNum,
    })
    if (demNum == 9) {
      // 挖到矿了！
      boomedNum = boomedNum + 1
      starAdd = utils.randomNum(31, 40)
      // 乘以后台设定的星星系数
      starAdd = starAdd * global.myAppConfig.deminingStarRatio
    }
    if (boomedNum >= boomNum) {
      close = 1
    }
    if (demNum == 9 && close === 1) {
      //如果是最后一矿且挖到矿了*3的矿
      starAdd = starAdd * 3
      console.info(
        chalk.green('当前为最后一片矿，三倍出矿，总出矿：' + starAdd)
      )
    }
    // 生成用户数据
    let levle = result_.level
    getExp = 10 + demNum + starAdd
    let exp = result_.exp + getExp
    let levelExp = utils.levelCheck(levle, exp)
    levelUpStar = levelExp[2] * 30
    let params = {
      $inc: {
        star: starAdd + levelUpStar,
        deminingStarCount: starAdd,
      },
      level: levelExp[0],
      exp: levelExp[1],
      captchaLock: false,
      ip: data.IP,
    }
    sendData['userParams'] = params
    sendData['levelUpStar'] = levelUpStar
    sendData['getExp'] = getExp

    // 生成道具数据
    userItemTools[0] = userItemTools[0] - 1
    let getItemObj = {}
    let update_ = {
      $inc: getItemObj,
      'item.400': userItemTools[0],
    }
    sendData['itemUpdate'] = update_
  } else if (useTool === 4) {
    // 宝石镐
    if (playData === null) {
      playData = {}
    }
    playData[centerInfo.y + '_' + centerInfo.x] = {
      md5: md5(data.email),
      num: demNum,
    }
    sendData.openInfoList.push({
      md5: md5(data.email),
      num: demNum,
    })
    if (demNum == 9) {
      // 挖到矿了！
      boomedNum = boomedNum + 1
    } else {
      let itemRare = utils.randomNum(1, 100) //随机一个随机道具因子
      let mapType = result.mapType
      if (itemRare >= 80) {
        //20%概率地图稀有道具
        let itemList = mapData[mapType].low
        getItem = itemList[utils.randomNum(0, itemList.length - 1)]
      } else {
        //80%概率地图常见道具
        let itemList = mapData[mapType].high
        getItem = itemList[utils.randomNum(0, itemList.length - 1)]
      }
      getItemNum = demNum + 1 //获得道具数量
      getItemNum = getItemNum * 7
      // 乘以后台的系数
      getItemNum = getItemNum * global.myAppConfig.deminingItemRatio
    }
    if (boomedNum >= boomNum) {
      close = 1
    }
    // 生成用户信息
    let levle = result_.level
    getExp = 10 + demNum + starAdd
    let exp = result_.exp + getExp
    let levelExp = utils.levelCheck(levle, exp)
    levelUpStar = levelExp[2] * 30
    let params = {
      $inc: {
        star: starAdd + levelUpStar,
        deminingStarCount: starAdd,
      },
      level: levelExp[0],
      exp: levelExp[1],
      captchaLock: false,
      ip: data.IP,
    }
    sendData['userParams'] = params
    sendData['levelUpStar'] = levelUpStar
    sendData['getExp'] = getExp
    sendData['userParams'] = params
    // 生成道具数据
    userItemTools[1] = userItemTools[1] - 1
    let getItemObj = {}
    // 如果没有挖到星星矿
    if (getItem) {
      getItemObj['item.' + getItem] = getItemNum
    }
    let update_ = {
      $inc: getItemObj,
      'item.401': userItemTools[1],
    }
    sendData['itemUpdate'] = update_
    sendData['getItem'] = getItem
    sendData['getItemNum'] = getItemNum
  } else if (useTool === 5) {
    // 炸弹
    if (playData === null) {
      playData = {}
    }
    // 添加周围一圈的坐标
    const x = centerInfo.x
    const y = centerInfo.y
    const maxRow = demInfo.rows - 1
    const maxCol = demInfo.cols - 1
    const boomList = [
      (y - 1 >= 0 ? y - 1 : maxCol) +
        '_' +
        (centerInfo.x - 1 >= 0 ? x - 1 : maxRow),
      (y - 1 >= 0 ? y - 1 : maxCol) + '_' + x,
      (y - 1 >= 0 ? y - 1 : maxCol) + '_' + (x + 1 <= maxRow ? x + 1 : 0),
      y + '_' + (x - 1 >= 0 ? x - 1 : maxRow),
      y + '_' + x,
      y + '_' + (x + 1 <= maxRow ? x + 1 : 0),
      (y + 1 <= maxCol ? y + 1 : 0) + '_' + (x - 1 >= 0 ? x - 1 : maxRow),
      (y + 1 <= maxCol ? y + 1 : 0) + '_' + x,
      (y + 1 <= maxCol ? y + 1 : 0) + '_' + (x + 1 <= maxRow ? x + 1 : 0),
    ]
    let getItemObj = {}
    let demNumAll = 0
    let boomItemList = {}
    for (let i = 0; i < boomList.length; i++) {
      const yx = boomList[i]
      const yxArr = yx.split('_')
      const playerMap = demInfo.player || {}
      if (!playerMap[yx]) {
        const thisDemNum = demInfo.map[yxArr[0]][yxArr[1]]
        demNumAll = demNumAll + thisDemNum
        playData[yx] = {
          md5: md5(data.email),
          num: thisDemNum,
        }
        sendData.openInfoList.push({
          md5: md5(data.email),
          num: thisDemNum,
          x: yxArr[1],
          y: yxArr[0],
        })
        if (thisDemNum == 9) {
          // 挖到矿了！
          boomedNum = boomedNum + 1
        } else {
          let itemRare = utils.randomNum(1, 100) //随机一个随机道具因子
          let mapType = result.mapType
          if (itemRare >= 80) {
            //20%概率地图稀有道具
            let itemList = mapData[mapType].low
            getItem = itemList[utils.randomNum(0, itemList.length - 1)]
          } else {
            //80%概率地图常见道具
            let itemList = mapData[mapType].high
            getItem = itemList[utils.randomNum(0, itemList.length - 1)]
          }
          getItemNum = thisDemNum + 2 //获得道具数量
          // 乘以后台的系数
          getItemNum = getItemNum * global.myAppConfig.deminingItemRatio
          if (getItemObj['item.' + getItem]) {
            getItemObj['item.' + getItem] =
              getItemObj['item.' + getItem] + getItemNum
            boomItemList[getItem] = boomItemList[getItem] + getItemNum
          } else {
            getItemObj['item.' + getItem] = getItemNum
            boomItemList[getItem] = getItemNum
          }
        }
      }
    }
    sendData['boomItemList'] = boomItemList
    if (boomedNum >= boomNum) {
      close = 1
    }
    // 生成用户数据
    let levle = result_.level
    getExp = 10 + demNumAll + starAdd
    let exp = result_.exp + getExp
    let levelExp = utils.levelCheck(levle, exp)
    levelUpStar = levelExp[2] * 30
    let params = {
      $inc: {
        star: starAdd + levelUpStar,
        deminingStarCount: starAdd,
      },
      level: levelExp[0],
      exp: levelExp[1],
      captchaLock: false,
      ip: data.IP,
    }
    sendData['userParams'] = params
    sendData['levelUpStar'] = levelUpStar
    sendData['getExp'] = getExp
    // 生成道具数据
    userItemTools[2] = userItemTools[2] - 1
    let update_ = {
      $inc: getItemObj,
      'item.402': userItemTools[2],
    }
    sendData['itemUpdate'] = update_
  }
  sendData['status'] = true
  sendData['close'] = close
  sendData['starAdd'] = starAdd
  sendData['boomedNum'] = boomedNum
  sendData['playData'] = playData

  let userData = {
    star: result_.star + starAdd,
    md5: result_.md5,
    nickName: result_.nickName,
    deminingStamp: deminingTool,
    userItemTools: userItemTools,
    timeNow: timeNow,
  }
  sendUserData(socket, userData)
  return sendData
}
exports.searchUser = async (socket, data) => {
  // 查找在线用户
  let page = data.page
  const userDataCount = _.groupBy(global.demining.onlinePlayer, (value) => {
    return value.email
  })
  if (!validator.isInt(page + '', { min: 1 })) {
    page = 1
  }
  const pagination = function (pageSize, currentPage, arr) {
    var skipNum = (currentPage - 1) * pageSize
    var newArr =
      skipNum + pageSize >= arr.length
        ? arr.slice(skipNum, arr.length)
        : arr.slice(skipNum, skipNum + pageSize)
    return newArr
  }
  const pushBy = function (group) {
    var list = []
    group.forEach((item) => {
      list.push(item.device)
    })
    return list
  }
  let pageUser = _.map(userDataCount, (item) => {
    return {
      md5: item[0].md5,
      nickName: item[0].nickName,
      loginTime: item[0].loginTime,
      deviceList: pushBy(item),
    }
  })
  pageUser = pagination(5, page, pageUser)
  socket.emit('demining', {
    code: 900,
    pageUser: pageUser,
    time: data.time,
    userTotal: Object.keys(userDataCount).length,
  })
}
exports.login = async function (token, socket) {
  let IP = ''
  if (socket.handshake.headers['x-forwarded-for'] != null) {
    IP = socket.handshake.headers['x-forwarded-for']
  } else {
    IP = socket.handshake.address
  }
  IP = IP.match(/\d+.\d+.\d+.\d+/)
  IP = IP ? IP.join('.') : 'No IP'
  let backData = {
    status: false,
    IP: IP,
  }
  if (token) {
    // 验证用户信息
    let result = await utils.tokenCheckAndEmail(token).catch((err) => {
      throw err
    })
    // 如果验证成功
    if (result) {
      backData = {
        status: true,
        userInfo: result,
        IP: IP,
      }
    }
  }
  return backData
}
exports.mine = async function (socket, data) {
  let IP = ''
  let timeNow = Math.round(new Date().getTime() / 1000)
  if (socket.handshake.headers['x-forwarded-for'] != null) {
    IP = socket.handshake.headers['x-forwarded-for']
  } else {
    IP = socket.handshake.address
  }
  IP = IP.match(/\d+.\d+.\d+.\d+/)
  IP = IP ? IP.join('.') : 'No IP'
  data.IP = IP
  console.info(chalk.green(IP + '连接挖矿服务器。'))
  let token = data.token
  if (token) {
    let result = await utils.tokenCheckAndEmail(token).catch((err) => {
      throw err
    })
    if (!result) {
      socket.emit('demining', {
        code: 403,
        msg: '账户信息已失效，请重新登录！',
        time: data.time,
      })
      socket.disconnect()
      console.info(chalk.yellow('查询结果无该用户,IP为：' + IP))
      return false
    }
    // 查询道具数据库
    const userItem = await itemDatabase
      .findOne({ email: result.email })
      .catch((err) => {
        socket.emit('demining', {
          code: 1,
          msg: '内部错误请联系管理员！',
          time: data.time,
        })
        console.error(chalk.red('数据库更新错误！'))
        throw err
      })
    let userItemTools = [0, 0, 0]
    if (userItem) {
      userItemTools = [
        userItem.item['400'] || 0,
        userItem.item['401'] || 0,
        userItem.item['402'] || 0,
      ]
    }
    data.userItemTools = userItemTools
    data.email = result.email
    console.info(chalk.green(IP + '的邮箱解析结果为' + data.email))
    //开始处理挖矿逻辑
    if (data.type == 'get') {
      console.info(chalk.green(data.email + '获取挖矿地图'))
      getMineMap(socket, false)
      let userData = {
        star: result.star,
        md5: result.md5,
        nickName: result.nickName,
        deminingStamp: result.deminingStamp,
        userItemTools: data.userItemTools,
        timeNow: timeNow,
      }
      sendUserData(socket, userData)
    } else if (data.type == 'open') {
      if (!validator.isInt(data.tool + '', { min: 0, max: 5 })) {
        socket.emit('demining', {
          code: 4,
          msg: '挖矿工具参数有误！',
          time: data.time,
        })
        console.info(
          chalk.yellow(
            data.email +
              '的工具参数有误，传了' +
              data.tool +
              '。' +
              'IP为：' +
              data.IP
          )
        )
        return false
      }
      data.tool = Math.floor(data.tool)
      data.tool = data.tool && data.tool <= 5 ? data.tool : 0
      let useTool = data.tool
      if (timeNow < Number(result.deminingStamp[useTool]) && useTool < 3) {
        console.info(
          chalk.yellow(
            data.email + '的工具' + useTool + '还在冷却。' + 'IP为：' + data.IP
          )
        )
        socket.emit('demining', {
          code: 4,
          msg: '您选择的工具还在制作中！',
          time: data.time,
        })
        let userData = {
          star: result.star,
          md5: result.md5,
          nickName: result.nickName,
          deminingStamp: result.deminingStamp,
          userItemTools: data.userItemTools,
          timeNow: timeNow,
        }
        sendUserData(socket, userData)
        return false
      } else if (useTool >= 3) {
        const itemNum = data.userItemTools[useTool - 3]
        if (itemNum < 1) {
          console.info(
            chalk.yellow(
              data.email +
                '的工具' +
                useTool +
                '储量不足。' +
                'IP为：' +
                data.IP
            )
          )
          socket.emit('demining', {
            code: 4,
            msg: '您所选的工具储量不足！',
            time: data.time,
          })
          let userData = {
            star: result.star,
            md5: result.md5,
            nickName: result.nickName,
            deminingStamp: result.deminingStamp,
            userItemTools: data.userItemTools,
            timeNow: timeNow,
          }
          sendUserData(socket, userData)
          return false
        }
      }
      // 机器人可疑度检测
      const robotCheck = result.robotCheck
      const captchaLock = result.captchaLock
      if (!(robotCheck === false && captchaLock === true)) {
        const robotCheckRes = await utils.RobotCheck(result)
        if (robotCheckRes) {
          // 判断验证码是否能通过
          socket.emit('demining', {
            code: 301,
            msg: 'ok',
            time: data.time,
          })
          return false
        }
      }
      await openNode(socket, data, result)
    } else if (data.type == 'searchPlayer') {
      this.searchUser(socket, data)
    }
  } else {
    console.info(chalk.yellow(data.email + '参数有误！'))
    socket.emit('demining', { code: 403, msg: '账户信息已失效，请重新登录！' })
    return false
  }
}
