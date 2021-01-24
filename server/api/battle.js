// 基本属性：攻击力、防御力、速度、HP
// 伤血 = 攻击力-防御力，最低为0
// 攻击由速度快的一方先行攻击，如果一样则每次随机
// 属性克制为火→风→水→火 暗→水火风 光→暗
// 相克属性对战时攻击会+1
// 攻击=x 防=x/2 血=x*2
// 如果是1、2、3、4、5、6顺子排列的卡牌则攻击力和防御力和血的x+20
// 每三种同属性的卡牌攻击力和防御力和血的x+1

// 攻击方式例子：
// 86攻43防172血火物卡牌（先手） vs 86攻43防172血暗治卡牌
// 回合1=》
// 86+8（物）=94 攻击对方 43防 -51 对方HP剩余 121
// 对方86+8（属性克制） = 94 攻击我方 43防 -51 血121 敌方回血8 剩余121+8 = 129

// 86攻43防、血121光魔卡牌（先手） vs 86攻43防、血129 暗防卡牌
// 回合2 =》
// 86+8（属性克制） = 94 攻击对方 43+8（防）防 -43 对方HP剩余86 我方吸血8 我方HP129
// 对方86 攻击我方 43防 -43 我方剩余86HP

// 86攻43防、血86光特卡牌（先手） vs 86攻43防、血86 光妨卡牌
// 回合3 =》
// 86(妨使增伤失效) 攻击对方 43 -43 对方HP剩余43
// 对方 86攻击我方 43（妨使增防失效）防 -43 我方HP剩余43

// 86攻43防、血43光特卡牌（先手） vs 86攻43防、血43 光魔卡牌
// 回合4=》
// 86+8（特） = 94 攻击对方 43防 -51 对方猝 我方赢

//红1
//蓝2
//绿3
//光4
//暗5

// 主动技能：
// 特7：我方攻击前攻击力临时+x*10%、敌方攻击时防御力临时+x*10%
// 魔2：敌方攻击后反弹攻击造成的伤害的20%
// 物1：我方攻击前攻击力临时+x*10%
// 防3：敌方攻击前防御力临时+x*10%
// 治4：我方攻击前我方HP+x*10%
// 支6：敌方攻击前临时产生x*20%的临时HP
// 妨5：使对方的主动技能失效

//被动能力
//全1
//兵2
//盾3
//速4
//爱5

const utils = require('../utils/utils')
const battleUtils = require('../utils/battle')
const userData = require('../utils/database/user')
const AiDataBase = require('../utils/database/ais')
const userbattleinfoData = require('../utils/database/userbattleinfo')
const battleLogsData = require('../utils/database/battleLogs')
const chalk = require('chalk')
const _ = require('lodash')

module.exports = async function (req, res, next) {
  let IP = utils.getUserIp(req)
  let token = req.body.token
  let advanced = req.body.advanced
  let timeNow = Math.round(new Date().getTime() / 1000)
  const aiMinScore = 7000
  if (global.checkScoreRankIng) {
    res.send({
      code: 0,
      msg: '系统正在结算竞技点中，请十分钟后再来尝试吧！！',
    })
    console.info(chalk.green('因为竞技点正在结算，无法成功对战，IP为：' + IP))
    return false
  }
  //解析token
  if (!token) {
    console.info(chalk.yellow(IP + '参数有误！'))
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
  let mycardIndexCount = result.cardIndexCount
  if (mycardIndexCount < 20) {
    res.send({
      code: 0,
      msg: '卡牌必须大于20张才能对战哦！赶快抽卡吧！',
    })
    console.info(chalk.green(email + '卡牌小于20不能对战。IP为：' + IP))
    return false
  }
  // 获取所有卡牌数据
  // 0全部卡牌，1为1星卡，2为2星卡，3为3星卡以此类推
  const allCardDataArr = await battleUtils.getAllCardInfo()

  // 获取对战次数结算
  const dataChanceData = utils.battleChance(result)
  // 计算当天战斗次数
  let battleOverTimes = 6 //最多可以储存多少次对战
  let dailyBattleTime = dataChanceData.dataTime
  let myBattleTimes = dataChanceData.battleChance //战斗次数
  let battleOverChance = false //是否超过对战次数
  // let dailyIsToday = false;//对战次数数据是否是当日
  if (myBattleTimes < 1) {
    battleOverChance = true
  }

  console.info(chalk.green(email + '开始匹配对战对手。IP为：' + IP))
  let myScore = result.score
  // 设一定概率遇到AI
  let AiP = utils.randomNum(1, 100) //AI概率因子
  let emData = []
  let seeAiP = 50
  const hitTime = timeNow - 3600 // 不重复遇到多少秒之前的敌人
  if (result.level <= 15) {
    //新手大概率遇到AI
    console.info(chalk.green(email + '是新手，高概率遇到AI。IP为：' + IP))
    seeAiP = 80
  }
  if (AiP > seeAiP) {
    //50%概率遇见AI
    if (advanced) {
      //如果是进阶匹配
      let emScore = {
        ban: 0,
        score: { $gte: myScore + 500 },
        email: { $ne: email },
        battleHitStamp: { $lte: hitTime },
        cardIndexCount: { $gte: 20 },
      }
      // 竞技点分数段内的
      emData = await battleUtils.searchEm(emScore)
    } else {
      let emMinScore = myScore - 500 < 0 ? 0 : myScore - 500
      let emMaxScore = myScore + 500
      let emScore = {
        ban: 0,
        score: { $gte: emMinScore, $lte: emMaxScore },
        email: { $ne: email },
        battleHitStamp: { $lte: hitTime },
        cardIndexCount: { $gte: 20 },
      }
      // 竞技点分数段内的
      emData = await battleUtils.searchEm(emScore)
    }
  }
  // 初始化一些信息
  let AiMode = emData.length > 0 ? false : true //没有对手的话进入ai模式
  let AiShouldSetLevel = false
  let AiData = []
  let AiInfo = {}
  // 初始化个人信息
  let MyName = result.nickName
  let MyMD5 = result.md5
  let EmName = ''
  let EmMD5 = ''
  // 初始化卡组
  let MyBattleCard = result.battleCard //我的对战卡牌
  let MyBattleCardArr_ = []
  let cardOtherData = {}
  let EmBattleCard = [] //对方的对战卡牌
  let EmBattleCardArr_ = []
  // 初始化我的属性
  let MyCardStarCount = [0, 0, 0, 0, 0, 0] //我的卡牌星级个数统计
  let MyStarAll = 0 //我的所以卡牌加起来的星级
  let MyCryCount = [0, 0, 0, 0, 0] //我的卡牌属性个数统计
  let MyADSHP = [0, 0, 0, 0] //我的攻、防、速、血
  let MyCardIndexCount = result.cardIndexCount //卡牌收集率
  let myCardLevel = {} //卡牌等级
  // 初始化对方属性
  let EmCardStarCount = [0, 0, 0, 0, 0, 0] //对方卡牌星级个数统计
  let EmCryCount = [0, 0, 0, 0, 0] //对方卡牌属性个数统计
  let EmStarAll = 0 //对方所以卡牌加起来的星级
  let EmADSHP = [0, 0, 0, 0] //对方的攻、防、速、血
  let EmCardIndexCount = 0
  let emCardLevel = {} //卡牌等级
  // 初始化胜负
  let win = 2
  let noDieWin = false //血没扣完的胜负

  // 如果没有设置对战卡牌则系统抽选卡牌
  if (MyBattleCard.length !== 20) {
    console.info(
      chalk.green(email + '并未设置出战卡牌，故由系统挑选卡牌。IP为：' + IP)
    )
    let packageIndex = Object.keys(result.card)
    //合并卡组
    MyBattleCard = []
    for (let i = 0; i < packageIndex.length; i++) {
      MyBattleCard = MyBattleCard.concat(
        Object.keys(result.card[packageIndex[i]])
      )
    }
    MyBattleCard = MyBattleCard.slice(
      MyBattleCard.length - 20,
      MyBattleCard.length
    )
    //MyBattleCard = MyBattleCard.sort(cardSort);
  }
  // 获取我的卡牌等级
  let myCardGetInfo = '-_id'
  for (let i = 0; i < MyBattleCard.length; i++) {
    myCardGetInfo = myCardGetInfo + ' cardLevel.' + MyBattleCard[i]
  }
  myCardLevel =
    (await userbattleinfoData
      .findOne({ email: email }, myCardGetInfo)
      .catch((err) => {
        res.send({
          code: 0,
          msg: '内部错误请联系管理员！',
        })
        console.error(chalk.red('数据库错误！'))
        throw err
      })) || {}
  myCardLevel = myCardLevel['cardLevel'] || {}
  // 设置我的出战卡牌信息
  MyBattleCardArr_ = [...MyBattleCard]
  MyBattleCard = await battleUtils.setBattleCardInfo(
    MyBattleCard,
    allCardDataArr
  )
  // 我的卡牌星级统计
  let MyCardStarRes = battleUtils.starCount(MyBattleCard)
  MyCardStarCount = MyCardStarRes[0]
  MyStarAll = MyCardStarRes[1]
  // 我的水晶统计
  MyCryCount = battleUtils.cryCount(MyBattleCard)
  // 我的攻防速血统计
  MyADSHP = battleUtils.setADSHP(
    MyBattleCard,
    MyCardStarCount,
    MyStarAll,
    MyCryCount,
    MyCardIndexCount,
    myCardLevel
  )
  // 设置敌方卡牌
  if (AiMode) {
    //无匹配的情况下给一个AI
    console.info(chalk.green(email + '无匹配的情况下给一个AI。IP为：' + IP))
    // 匹配一个合适的AI
    let emMinScore = myScore - 500 < 0 ? 0 : myScore - 500
    let emMaxScore = myScore + 500
    let AiScore = {
      score: { $gte: emMinScore, $lte: emMaxScore },
      email: { $ne: email },
      battleHitStamp: { $lte: hitTime },
      cardIndexCount: { $gte: 20 },
    }
    let searchAiP = utils.randomNum(1, 100) //AI概率因子
    if (searchAiP > 50 && myScore > aiMinScore) {
      // 如果竞技点大于9000会有概率遇到人形高达
      AiData = await battleUtils.searchAi(AiScore)
    }
    if (AiData.length > 0) {
      // 有符合要求的AI
      const thisAi = AiData[0]
      EmBattleCard = thisAi.battleCard
      EmName = '人形高达' + utils.randomNum(0, 99) + '号'
      EmCardIndexCount = thisAi.cardIndexCount
      emCardLevel = thisAi.cardLevel || {}
    } else {
      // 没有符合要求的AI创建新AI
      // 给ai设置信息
      EmBattleCard = battleUtils.creatAICard(MyCardStarCount, allCardDataArr)
      // EmBattleCard = EmBattleCard.sort(cardSort);
      EmName = '自动书记人偶' + utils.randomNum(0, 99) + '号'
      if (MyCardIndexCount < 200 && !advanced) {
        EmCardIndexCount = MyCardIndexCount + utils.randomNum(-550, 0)
      } else {
        EmCardIndexCount = MyCardIndexCount + utils.randomNum(-300, 200)
      }
      if (EmCardIndexCount < 20) {
        EmCardIndexCount = 20
      }
      // 老版进阶加成：EmCardIndexCount = MyCardIndexCount+utils.randomNum(-125,300);
      //给AI设置等级
      AiShouldSetLevel = true
      // let myCardLevelArr = Object.entries(myCardLevel);
      // //打乱卡牌数组
      // let EmBattleCardRadomArr = [...EmBattleCard];
      // EmBattleCardRadomArr.sort(function () { return Math.random() > 0.5 ? -1 : 1; });
      // for (let i = 0; i < myCardLevelArr.length; i++) {
      //     emCardLevel[EmBattleCardRadomArr[i]] = myCardLevelArr[i][1];
      // }
      AiInfo['battleCard'] = _.cloneDeep(EmBattleCard)
      // AiInfo["cardLevel"] = _.cloneDeep(emCardLevel);
      AiInfo['cardIndexCount'] = EmCardIndexCount
    }
  } else {
    // 有匹配设置对方的卡牌
    emData = emData[0]
    EmName = emData.nickName
    EmMD5 = emData.md5
    EmBattleCard = emData.battleCard
    EmCardIndexCount = emData.cardIndexCount
    if (EmBattleCard.length !== 20) {
      // 对方并未设置对战卡牌
      console.info(
        chalk.green(
          '对手' + emData.email + '并未设置对战卡牌，故由系统挑选。IP为：' + IP
        )
      )
      let packageIndex = Object.keys(emData.card)
      //合并卡组
      EmBattleCard = []
      for (let i = 0; i < packageIndex.length; i++) {
        EmBattleCard = EmBattleCard.concat(
          Object.keys(emData.card[packageIndex[i]])
        )
      }
      EmBattleCard = EmBattleCard.slice(
        EmBattleCard.length - 20,
        EmBattleCard.length
      )
      //EmBattleCard = EmBattleCard.sort(cardSort);
    }
    let emCardGetInfo = '-_id'
    for (let i = 0; i < EmBattleCard.length; i++) {
      emCardGetInfo = emCardGetInfo + ' cardLevel.' + EmBattleCard[i]
    }
    emCardLevel =
      (await userbattleinfoData
        .findOne({ email: emData.email }, emCardGetInfo)
        .catch((err) => {
          res.send({
            code: 0,
            msg: '内部错误请联系管理员！',
          })
          console.error(chalk.red('数据库错误！'))
          throw err
        })) || {}
    emCardLevel = emCardLevel['cardLevel'] || {}
  }
  // 设置对方出战卡牌信息
  EmBattleCardArr_ = [...EmBattleCard]
  EmBattleCard = await battleUtils.setBattleCardInfo(
    EmBattleCard,
    allCardDataArr
  )
  if (AiShouldSetLevel) {
    // 统计卡牌的cost
    const levelCost = battleUtils.countCost(myCardLevel, MyBattleCard)
    emCardLevel = battleUtils.creatAILevel(EmBattleCard, levelCost)
    AiInfo['cardLevel'] = _.cloneDeep(emCardLevel)
  }
  // 对方卡牌星级统计
  let EmCardStarRes = battleUtils.starCount(EmBattleCard)
  EmCardStarCount = EmCardStarRes[0]
  EmStarAll = EmCardStarRes[1]
  // 对方的水晶统计
  EmCryCount = battleUtils.cryCount(EmBattleCard)
  // 敌方攻防速血统计
  EmADSHP = battleUtils.setADSHP(
    EmBattleCard,
    EmCardStarCount,
    EmStarAll,
    EmCryCount,
    EmCardIndexCount,
    emCardLevel
  )
  // 初始敌我数值
  EmADSHP_ = [...EmADSHP]
  MyADSHP_ = [...MyADSHP]
  // 开始战斗
  let MyBattleData = []
  let EmBattleData = []
  let speed = 1 //1为我方打，0为对方打
  let MyBuff = []
  let MyDebuff = []
  let EmBuff = []
  let EmDebuff = []
  if (MyADSHP[2] < EmADSHP[2]) {
    speed = 0
  } else if (MyADSHP[2] === EmADSHP[2]) {
    speed = utils.randomNum(0, 1)
  }
  for (let i = 0; i < 20; i++) {
    //最多不超过20局
    if (speed) {
      //如果我方速度快
      // 我方攻击
      let MybattleDataRound = battleUtils.cardBattle(
        MyADSHP,
        MyBattleCard[i],
        EmADSHP,
        EmBattleCard[i],
        MyBuff,
        MyDebuff,
        EmBuff,
        EmDebuff
      )
      MyADSHP[3] = MybattleDataRound[1]
      EmADSHP[3] = MybattleDataRound[3]
      MyBuff = _.cloneDeep(MybattleDataRound[5])
      MyDebuff = _.cloneDeep(MybattleDataRound[6])
      EmBuff = _.cloneDeep(MybattleDataRound[7])
      EmDebuff = _.cloneDeep(MybattleDataRound[8])
      MyBattleData.push(MybattleDataRound)
      win = battleUtils.isWin(MyADSHP, EmADSHP)
      if (win !== 3) {
        break
      }
      // 对方攻击
      let EmbattleDataRound = battleUtils.cardBattle(
        EmADSHP,
        EmBattleCard[i],
        MyADSHP,
        MyBattleCard[i],
        EmBuff,
        EmDebuff,
        MyBuff,
        MyDebuff
      )
      MyADSHP[3] = EmbattleDataRound[3]
      EmADSHP[3] = EmbattleDataRound[1]
      MyBuff = _.cloneDeep(EmbattleDataRound[7])
      MyDebuff = _.cloneDeep(EmbattleDataRound[8])
      EmBuff = _.cloneDeep(EmbattleDataRound[5])
      EmDebuff = _.cloneDeep(EmbattleDataRound[6])
      EmBattleData.push(EmbattleDataRound)
      win = battleUtils.isWin(MyADSHP, EmADSHP)
      if (win !== 3) {
        break
      }
    } else {
      // 对方攻击
      let EmbattleDataRound = battleUtils.cardBattle(
        EmADSHP,
        EmBattleCard[i],
        MyADSHP,
        MyBattleCard[i],
        EmBuff,
        EmDebuff,
        MyBuff,
        MyDebuff
      )
      MyADSHP[3] = EmbattleDataRound[3]
      EmADSHP[3] = EmbattleDataRound[1]
      MyBuff = _.cloneDeep(EmbattleDataRound[7])
      MyDebuff = _.cloneDeep(EmbattleDataRound[8])
      EmBuff = _.cloneDeep(EmbattleDataRound[5])
      EmDebuff = _.cloneDeep(EmbattleDataRound[6])
      EmBattleData.push(EmbattleDataRound)
      win = battleUtils.isWin(MyADSHP, EmADSHP)
      if (win !== 3) {
        break
      }
      // 我方攻击
      let MybattleDataRound = battleUtils.cardBattle(
        MyADSHP,
        MyBattleCard[i],
        EmADSHP,
        EmBattleCard[i],
        MyBuff,
        MyDebuff,
        EmBuff,
        EmDebuff
      )
      MyADSHP[3] = MybattleDataRound[1]
      EmADSHP[3] = MybattleDataRound[3]
      MyBuff = _.cloneDeep(MybattleDataRound[5])
      MyDebuff = _.cloneDeep(MybattleDataRound[6])
      EmBuff = _.cloneDeep(MybattleDataRound[7])
      EmDebuff = _.cloneDeep(MybattleDataRound[8])
      MyBattleData.push(MybattleDataRound)
      win = battleUtils.isWin(MyADSHP, EmADSHP)
      if (win !== 3) {
        break
      }
    }
    // buff与debuff回合衰减
    for (let i = 0; i < MyBuff.length; i++) {
      const isNew = MyBuff[i].isNew
      const count = MyBuff[i].count
      if (isNew) {
        MyBuff[i].isNew = false
      } else {
        MyBuff[i].count = count - 1
      }
    }
    MyBuff = MyBuff.filter((item) => item.count > 0)

    for (let i = 0; i < MyDebuff.length; i++) {
      const isNew = MyDebuff[i].isNew
      const count = MyDebuff[i].count
      if (isNew) {
        MyDebuff[i].isNew = false
      } else {
        MyDebuff[i].count = count - 1
      }
    }
    MyDebuff = MyDebuff.filter((item) => item.count > 0)

    for (let i = 0; i < EmBuff.length; i++) {
      const isNew = EmBuff[i].isNew
      const count = EmBuff[i].count
      if (isNew) {
        EmBuff[i].isNew = false
      } else {
        EmBuff[i].count = count - 1
      }
    }
    EmBuff = EmBuff.filter((item) => item.count > 0)

    for (let i = 0; i < EmDebuff.length; i++) {
      const isNew = EmDebuff[i].isNew
      const count = EmDebuff[i].count
      if (isNew) {
        EmDebuff[i].isNew = false
      } else {
        EmDebuff[i].count = count - 1
      }
    }
    EmDebuff = EmDebuff.filter((item) => item.count > 0)
  }
  if (win === 3) {
    //打完还是3需要根据HP扣血情况判断
    if (MyADSHP[3] > EmADSHP[3] && EmADSHP[3] / EmADSHP_[3] < 0.8) {
      win = 1
      noDieWin = true
    } else if (MyADSHP[3] < EmADSHP[3] && MyADSHP[3] / MyADSHP_[3] < 0.8) {
      win = 0
      noDieWin = true
    } else {
      win = 2
    }
  }
  myBattleTimes = myBattleTimes - 1
  // 如果结算后的对战次数剩余5则重新开始计时
  if (myBattleTimes === 5) {
    dailyBattleTime = Math.round(new Date().getTime() / 1000)
  }
  // 只获取已经战斗过卡牌的等级
  let MyBattleDataCount = MyBattleData.length
  let EmBattleDataCount = EmBattleData.length
  let biggerCount =
    MyBattleDataCount >= EmBattleDataCount
      ? MyBattleDataCount
      : EmBattleDataCount
  let MybattledCardLevel = {}
  let EmbattledCardLevel = {}
  MyBattleCardArr_ = MyBattleCardArr_.slice(0, biggerCount)
  EmBattleCardArr_ = EmBattleCardArr_.slice(0, biggerCount)
  for (let i = 0; i < biggerCount; i++) {
    MybattledCardLevel[MyBattleCardArr_[i]] =
      myCardLevel[MyBattleCardArr_[i]] || 0
    EmbattledCardLevel[EmBattleCardArr_[i]] =
      emCardLevel[EmBattleCardArr_[i]] || 0
    cardOtherData[MyBattleCard[i].cardId] = {
      rightType: MyBattleCard[i].rightType,
      packageId: MyBattleCard[i].packageId,
    }
    cardOtherData[EmBattleCard[i].cardId] = {
      rightType: EmBattleCard[i].rightType,
      packageId: EmBattleCard[i].packageId,
    }
  }
  // 如果并未超过当日的对战次数则结算竞技点、经验
  let getScore = 0 //获取竞技点
  let getExp = 0 //获取经验
  let EmScore = 0 //对方的竞技点
  let EmGetScore = 0
  let levelUpStar = 0
  let battleGetStar = 0
  let MyScore = result.score //我的竞技点
  if (!battleOverChance) {
    let userFilters = null
    let updataParams = null
    let EmUserFilters = null
    let EmUpdataParams = null
    let AiUserFilters = null
    let AiUpdataParams = null
    if (AiMode) {
      //如果是AI模式则竞技点与自己一样
      if (AiData.length > 0) {
        EmScore = AiData[0].score
      } else {
        EmScore = MyScore
      }
      // if(advanced){
      //     EmScore = EmScore+70;
      // }
    } else {
      EmScore = emData.score
    }
    if (win === 1) {
      //如果是赢
      getScore = Math.round((EmScore - MyScore) / 2)
      if (getScore < 10) {
        getScore = 10
      } else if (getScore > 90) {
        //最多获得90竞技点
        getScore = 90
      }
      // if (advanced && getScore >= 90) {
      //     getScore = 120;
      // }
      if (noDieWin) {
        //如果没打死对方按比例加成
        getScore = Math.round(getScore * (1 - EmADSHP[3] / EmADSHP_[3]))
      }
      EmGetScore = -getScore
      getExp = getScore + 10
      // 如果胜利获得3星星
      battleGetStar = 3
      // 写入我方胜利数据
      let myLevle = result.level
      let MyExp = result.exp + getExp
      let levelExp = utils.levelCheck(myLevle, MyExp)
      levelUpStar = levelExp[2] * 30
      userFilters = {
        email: email,
      }
      updataParams = {
        $inc: {
          star: levelUpStar + battleGetStar,
        },
        battled: true,
        battleStamp: dailyBattleTime,
        battleDailyCount: myBattleTimes,
        score: result.score + getScore,
        level: levelExp[0],
        exp: levelExp[1],
        ip: IP,
      }
      let EmNewScore = EmScore + EmGetScore
      if (EmNewScore < 0) {
        //防止竞技点小于0
        EmNewScore = 0
      }
      if (!AiMode) {
        EmUserFilters = {
          email: emData.email,
        }
        EmUpdataParams = {
          score: EmNewScore,
          battleHitStamp: timeNow,
        }
      } else if (AiData.length > 0) {
        // ai数据写入
        AiUserFilters = {
          _id: AiData[0]._id,
        }
        AiUpdataParams = {
          score: EmNewScore,
          battleHitStamp: timeNow,
          $inc: {
            loseCount: 1,
          },
        }
      }
      console.info(chalk.green(email + '对战胜利。IP为：' + IP))
    } else if (win === 0) {
      //如果是输
      getScore = Math.round((EmScore - MyScore) / 2)
      if (getScore > -10) {
        //如果对方竞技点比我们高也要至少扣十点竞技点
        getScore = -10
      } else if (getScore < -90) {
        //最多扣90分
        getScore = -90
      }
      // if (advanced && getScore <= -90) {
      //     getScore = -120;
      // }
      if (noDieWin) {
        //如果没打死对方按比例加成
        getScore = Math.round(getScore * (1 - MyADSHP[3] / MyADSHP_[3]))
      }
      EmGetScore = Math.abs(getScore)
      let myNewScore = result.score + getScore
      if (myNewScore < 0) {
        //防止竞技点小于0
        myNewScore = 0
      }
      userFilters = {
        email: email,
      }
      updataParams = {
        battled: true,
        battleStamp: dailyBattleTime,
        battleDailyCount: myBattleTimes,
        score: myNewScore,
        ip: IP,
      }
      let EmNewScore = EmScore + EmGetScore
      if (!AiMode) {
        EmUserFilters = {
          email: emData.email,
        }
        EmUpdataParams = {
          score: EmNewScore,
          battleHitStamp: timeNow,
        }
      } else if (AiData.length > 0) {
        // ai数据写入
        AiUserFilters = {
          _id: AiData[0]._id,
        }
        AiUpdataParams = {
          score: EmNewScore,
          battleHitStamp: timeNow,
          loseCount: 0,
        }
      } else if (AiMode && AiData.length <= 0 && myScore >= aiMinScore) {
        // 创建一个AI到库中
        AiInfo['creatDate'] = timeNow
        AiInfo['battleHitStamp'] = timeNow
        AiInfo['score'] = EmNewScore
        AiInfo['loseCount'] = 0
        battleUtils.writeAi(AiInfo)
      }
      console.info(chalk.green(email + '战败。IP为：' + IP))
    } else {
      // 如果没有对战过则写入已战斗
      userFilters = {
        email: email,
      }
      updataParams = {
        battleStamp: dailyBattleTime,
        battleDailyCount: myBattleTimes,
        ip: IP,
      }
      if (!result.battled) {
        updataParams['battled'] = true
      }
      // 平局写入被战斗记录
      if (!AiMode) {
        EmUserFilters = {
          email: emData.email,
        }
        EmUpdataParams = {
          battleHitStamp: timeNow,
        }
      } else if (AiData.length > 0) {
        // ai数据写入
        AiUserFilters = {
          _id: AiData[0]._id,
        }
        AiUpdataParams = {
          battleHitStamp: timeNow,
          loseCount: 0,
        }
      } else if (AiMode && AiData.length <= 0 && myScore >= aiMinScore) {
        // 创建一个AI到库中
        AiInfo['creatDate'] = timeNow
        AiInfo['battleHitStamp'] = timeNow
        AiInfo['score'] = EmScore
        AiInfo['loseCount'] = 0
        battleUtils.writeAi(AiInfo)
      }
    }
    //胜负统计
    let userbattleinfoDataUpdata = {}
    let emuserbattleinfoDataUpdata = {}
    // 安全起见再判断下是不是在更新竞技点
    if (global.checkScoreRankIng) {
      res.send({
        code: 0,
        msg: '系统正在结算竞技点中，请十分钟后再来尝试吧！！',
      })
      console.info(chalk.green('因为竞技点正在结算，无法成功对战，IP为：' + IP))
      return false
    }
    if (win === 1) {
      userbattleinfoDataUpdata = { $inc: { win: 1 } }
      emuserbattleinfoDataUpdata = { $inc: { lose: 1 } }
    } else if (win === 0) {
      userbattleinfoDataUpdata = { $inc: { lose: 1 } }
      emuserbattleinfoDataUpdata = { $inc: { win: 1 } }
    } else {
      userbattleinfoDataUpdata = { $inc: { draw: 1 } }
      emuserbattleinfoDataUpdata = { $inc: { draw: 1 } }
    }
    await userbattleinfoData
      .findOneAndUpdate({ email: email }, userbattleinfoDataUpdata)
      .catch((err) => {
        res.send({
          code: 0,
          msg: '内部错误请联系管理员！',
        })
        console.error(chalk.red('数据库更新错误！'))
        throw err
      })
    //写入对方用户战斗数据
    if (!AiMode) {
      await userbattleinfoData
        .findOneAndUpdate({ email: emData.email }, emuserbattleinfoDataUpdata)
        .catch((err) => {
          res.send({
            code: 0,
            msg: '内部错误请联系管理员！',
          })
          console.error(chalk.red('数据库更新错误！'))
          throw err
        })
    }
    if (userFilters) {
      await userData.updataUser(userFilters, updataParams).catch((err) => {
        res.send({
          code: 0,
          msg: '内部错误请联系管理员！',
        })
        console.error(chalk.red('数据库更新错误！'))
        throw err
      })
    }
    if (EmUserFilters) {
      await userData.updataUser(EmUserFilters, EmUpdataParams).catch((err) => {
        res.send({
          code: 0,
          msg: '内部错误请联系管理员！',
        })
        console.error(chalk.red('数据库更新错误！'))
        throw err
      })
    }
    if (AiUserFilters) {
      // 如果有更新AI数据
      // 判断AI连输
      if (
        (AiData[0].loseCount >= 9 && win === 1) ||
        (AiUpdataParams['score'] || aiMinScore) < aiMinScore
      ) {
        // 十连输或者竞技点低于9000删除该AI
        await AiDataBase.deleteAiOne(AiUserFilters).catch((err) => {
          res.send({
            code: 0,
            msg: '内部错误请联系管理员！',
          })
          console.error(chalk.red('数据库更新错误！'))
          throw err
        })
      } else {
        await AiDataBase.updataAi(AiUserFilters, AiUpdataParams).catch(
          (err) => {
            res.send({
              code: 0,
              msg: '内部错误请联系管理员！',
            })
            console.error(chalk.red('数据库更新错误！'))
            throw err
          }
        )
      }
    }
    // 写入战斗记录
    let battleLogsParams = {
      aEmail: email,
      dEmail: emData.email,
      time: timeNow,
      data: {
        MyBattleCard: MyBattleCardArr_,
        cardOtherData: cardOtherData,
        myCardLevel: MybattledCardLevel,
        MyADSHP: MyADSHP_,
        MyName: MyName,
        MyMD5: MyMD5,
        MyCardIndexCount: MyCardIndexCount,
        EmBattleCard: EmBattleCardArr_,
        emCardLevel: EmbattledCardLevel,
        EmADSHP: EmADSHP_,
        EmName: EmName,
        EmMD5: EmMD5,
        MyBattleData: MyBattleData,
        EmBattleData: EmBattleData,
        win: win,
        speed: speed,
        score: myScore,
        getScore: getScore,
        getExp: getExp,
        EmGetScore: EmGetScore,
        EmCardIndexCount: EmCardIndexCount,
        ver: 3,
      },
    }
    battleLogsData.saveBattleLog(battleLogsParams).catch((err) => {
      console.error(chalk.red('数据库更新错误！'))
      throw err
    })
    if (win === 1) {
      //如果是赢写入公共动态
      let logObject = {
        email: email,
        md5: result.md5,
        nickName: result.nickName,
        type: 'battle',
        time: timeNow,
        data: {
          win: win,
          EmName: EmName,
          EmMD5: EmMD5,
          getScore: getScore,
          getExp: getExp,
        },
        ip: IP,
      }
      utils.writeLog(logObject)
    }
  }
  // 记得赢了才更新对战时间和次数

  res.send({
    code: 1,
    // MyCardStarCount:MyCardStarCount,
    // MyStarAll:MyStarAll,
    // MyCryCount:MyCryCount,
    MyBattleCard: MyBattleCardArr_,
    cardOtherData: cardOtherData,
    MyADSHP: MyADSHP_,
    MyName: MyName,
    MyMD5: MyMD5,
    // EmCardStarCount:EmCardStarCount,
    // EmStarAll:EmStarAll,
    // EmCryCount:EmCryCount,
    EmBattleCard: EmBattleCardArr_,
    EmADSHP: EmADSHP_,
    EmName: EmName,
    EmMD5: EmMD5,
    MyBattleData: MyBattleData,
    EmBattleData: EmBattleData,
    win: win,
    speed: speed,
    myBattleTimes: myBattleTimes,
    battleStamp: dailyBattleTime,
    battleOverChance: battleOverChance,
    score: myScore,
    getScore: getScore,
    getExp: getExp,
    levelUpStar: levelUpStar,
    battleGetStar: battleGetStar,
    battleOverTimes: battleOverTimes,
    msg: '获取成功',
  })
}
