const utils = require('../utils/utils')
const AiDataBase = require('../utils/database/ais')
const chalk = require('chalk')
const cardData = require('../utils/database/cardData')
const usersModel = require('../models/users')
const AisModel = require('../models/ais')
const _ = require('lodash')

exports.isWin = function (MyADSHP, EmADSHP) {
  if (MyADSHP[3] <= 0 && EmADSHP[3] <= 0) {
    return 2 //平局
  } else if (EmADSHP[3] <= 0) {
    return 1 //赢
  } else if (MyADSHP[3] <= 0) {
    return 0 //输
  } else {
    return 3
  }
}
// 对战
exports.cardBattle = function (
  AttackADSHP,
  AttackCard,
  DefendEmADSHP,
  DefendCard,
  AttackBuff,
  AttackDebuff,
  DefendBuff,
  DefendDebuff
) {
  // 主动技能：
  // 物1
  // 魔2
  // 防3
  // 治4：解除异常状态，恢复攻+8%*星级的SAN，接下来2回合恢复攻的14%的SAN
  // 妨5
  // 支6
  // 特7

  //红1
  //蓝2
  //绿3
  //光4
  //暗5

  // buff
  // 回血buff:1
  // 加攻防buff:2

  // debuff
  // 烧伤:1
  // 冻伤:2
  // 毒:3
  // 混乱:4
  // 恐惧:5

  // 克制表属性克制为火→风→水→火 光←→暗

  // 20190516修改
  // 物：攻= +攻*10%*星级
  // 防：防= +防*10%*星级
  // 支：产生对方伤害*10*星级的护盾
  // 特：攻=攻*6%*星级、防=攻*6%*星级
  // 治：SAN = +攻*10*星级
  // 魔：反弹对方伤害的10%*星级

  // 克：增伤10%*星级差(最多10%)
  // 被克：防御减少10%*星级差(最多10%)
  let cryKe = {
    1: [3],
    2: [1],
    3: [2],
    4: [5],
    5: [4],
  }
  let AttackRightType = AttackCard.rightType
  let AttackCry = AttackCard.cry
  let AttackA = AttackADSHP[0]
  let AttackD = AttackADSHP[1]
  let AttackHP = AttackADSHP[3]
  // let AttackShield = 0;//临时护盾
  let AttackStar = AttackCard.star //攻击卡牌的星级
  let AttackAddHP = 0 //加血多少
  let AttackCanSkill = true

  let DefendRightType = DefendCard.rightType
  // let DefendCry = DefendCard.cry;
  let DefendA = DefendEmADSHP[0]
  let DefendD = DefendEmADSHP[1]
  let DefendHP = DefendEmADSHP[3]
  let DefendShield = 0 //临时护盾
  let DefendStar = DefendCard.star //防守卡牌的星级
  let DefendCanSkill = true

  // 攻击方攻击前
  // 如果为妨，结算是否成功发动
  if (DefendRightType === 5) {
    const DefendFangYinZi = utils.randomNum(1, 100)
    const DefendFangRange = 16 * DefendStar
    if (DefendFangYinZi < DefendFangRange) {
      AttackCanSkill = false
    }
  }

  if (AttackCanSkill) {
    if (AttackRightType === 1 || AttackRightType === 2) {
      AttackA = AttackA + Math.floor(AttackA * 0.09 * AttackStar)
    } else if (AttackRightType === 3) {
      AttackA = Math.floor(AttackD * 0.4 * AttackStar)
    } else if (AttackRightType === 4) {
      // 治疗清空debuff
      AttackDebuff = []
      AttackAddHP = Math.floor(AttackA * 0.08 * AttackStar)
      AttackHP = AttackHP + AttackAddHP
      const newBuff = {
        id: 1,
        count: 2,
        star: AttackStar,
        isNew: true,
      }
      AttackBuff.push(newBuff)
    } else if (AttackRightType === 5) {
      DefendD = DefendD - Math.floor(DefendD * 0.1 * (7 - AttackStar))
    } else if (AttackRightType === 6) {
      const newBuff = {
        id: 2,
        count: 1,
        star: AttackStar,
        isNew: true,
      }
      AttackBuff.push(newBuff)
    } else if (AttackRightType === 7) {
      const newDeBuff = {
        id: AttackCry,
        count: 2,
        star: AttackStar,
        isNew: true,
      }
      DefendDebuff.push(newDeBuff)
    }
  }
  // 如果攻击方的主动技能为物，则攻防不会受到属性影响
  if (AttackRightType !== 1) {
    // 攻击前结算属性相克
    let ke = cryKe[AttackCard.cry].indexOf(DefendCard.cry)
    let beike = cryKe[DefendCard.cry].indexOf(AttackCard.cry)
    // 如果攻击方为魔，则加成为1
    let moAdd = AttackRightType === 2 ? 1 : 0
    if (ke !== -1) {
      //克制增伤
      let starCha = AttackStar - DefendStar //星级差
      if (starCha < 1) {
        starCha = 1
      }
      starCha = starCha + moAdd
      AttackA = AttackA + Math.floor(AttackA * 0.1 * starCha)
    }
    if (beike !== -1) {
      //被克减伤
      let starCha = DefendStar - AttackStar //星级差
      if (starCha < 1) {
        starCha = 1
      }
      DefendD = DefendD + Math.floor(DefendD * 0.1 * starCha)
    }
  }

  // 如果为妨，结算是否成功发动
  if (AttackRightType === 5) {
    const AttackFangYinZi = utils.randomNum(1, 100)
    const AttackFangRange = 16 * AttackStar
    if (AttackFangYinZi < AttackFangRange) {
      DefendCanSkill = false
    }
  }

  // 防守方接受攻击前
  // ...
  // 结算buff
  // 结算攻击方buff
  for (let i = 0; i < AttackBuff.length; i++) {
    const isNew = AttackBuff[i].isNew
    if (!isNew) {
      const id = AttackBuff[i].id
      const star = AttackBuff[i].star
      if (id === 1) {
        const plusAddHP = Math.floor(AttackADSHP[0] * 0.04 * star)
        AttackAddHP = AttackAddHP + plusAddHP
        AttackHP = AttackHP + plusAddHP
      } else if (id === 2) {
        AttackA = Math.floor(AttackA + AttackA * (0.11 * star))
      }
    }
  }
  // 结算防守方的buff
  for (let i = 0; i < DefendBuff.length; i++) {
    const isNew = DefendBuff[i].isNew
    if (!isNew) {
      const id = DefendBuff[i].id
      const star = DefendBuff[i].star
      if (id === 2) {
        DefendD = Math.floor(DefendD + DefendD * (0.02 * star))
      }
    }
  }

  // 开始攻击
  let AttackPow = AttackA - DefendD - DefendShield
  if (DefendCanSkill) {
    if (DefendRightType === 3) {
      AttackPow = Math.floor(AttackPow * (1 - 0.1 * DefendStar))
    }
  }
  if (AttackPow < 0) {
    AttackPow = 0
  }
  // 结算扣血
  DefendHP = DefendHP - AttackPow
  // 结算伤害反弹或者debuff造成的伤害
  let DefendPow = 0
  // if (DefendRightType === 2 && AttackRightType !== 5) {
  //     DefendPow = Math.floor(AttackPow * 0.10 * DefendStar);
  //     AttackHP = AttackHP - DefendPow;
  // }
  // 结算debuff造成的伤害
  for (let i = 0; i < AttackDebuff.length; i++) {
    const isNew = AttackDebuff[i].isNew
    if (!isNew) {
      const id = AttackDebuff[i].id
      const star = AttackDebuff[i].star
      if (id === 1) {
        DefendPow = Math.floor(
          DefendPow + DefendEmADSHP[0] * (AttackCry === 3 ? 0.065 : 0.06) * star
        )
      } else if (id === 2) {
        DefendPow = Math.floor(
          DefendPow + DefendEmADSHP[0] * (AttackCry === 1 ? 0.065 : 0.06) * star
        )
      } else if (id === 3) {
        DefendPow = Math.floor(
          DefendPow + DefendEmADSHP[0] * (AttackCry === 2 ? 0.065 : 0.06) * star
        )
      } else if (id === 4) {
        DefendPow = Math.floor(
          DefendPow + AttackADSHP[0] * (AttackCry === 5 ? 0.065 : 0.06) * star
        )
      } else if (id === 5) {
        DefendPow = Math.floor(
          DefendPow + AttackADSHP[0] * (AttackCry === 4 ? 0.065 : 0.06) * star
        )
      }
    }
  }
  AttackHP = AttackHP - DefendPow

  // 防止HP为负数
  if (DefendHP < 0) {
    DefendHP = 0
  }
  if (AttackHP < 0) {
    AttackHP = 0
  }
  return [
    AttackPow,
    AttackHP,
    DefendPow,
    DefendHP,
    AttackAddHP,
    AttackBuff,
    AttackDebuff,
    DefendBuff,
    DefendDebuff,
    AttackCanSkill,
    DefendCanSkill,
  ]
}
// 寻找对手
exports.searchEm = async function (parmas) {
  let query = usersModel.find(parmas)
  let total = await query.countDocuments()
  let data = await query
    .find()
    .skip(utils.randomNum(0, total - 1))
    .limit(1)
  return data
}

// 寻找Ai
exports.searchAi = async function (parmas) {
  let query = AisModel.find(parmas)
  let total = await query.countDocuments()
  let data = await query
    .find()
    .skip(utils.randomNum(0, total - 1))
    .limit(1)
  return data
}
// 写入Ai
exports.writeAi = function (parmas) {
  AiDataBase.saveAi(parmas).catch((err) => {
    console.error(chalk.red('数据库更新错误！'))
    throw err
  })
}
// 出战卡牌信息写入
exports.setBattleCardInfo = function (cardArr, allCardDataArr) {
  let myCardData = allCardDataArr[0]
  myCardData = myCardData.filter((item) => cardArr.indexOf(item.cardId) !== -1)
  myCardData.sort((a, b) => {
    if (cardArr.indexOf(a.cardId) === -1 && cardArr.indexOf(b.cardId) === -1) {
      return 1
    } else if (
      cardArr.indexOf(a.cardId) !== -1 &&
      cardArr.indexOf(b.cardId) === -1
    ) {
      return -1
    } else if (
      cardArr.indexOf(a.cardId) === -1 &&
      cardArr.indexOf(b.cardId) !== -1
    ) {
      return 1
    }
    return cardArr.indexOf(a.cardId) - cardArr.indexOf(b.cardId)
  })
  return myCardData
}
// 统计星级
exports.starCount = function (cardArr) {
  let starArr = [0, 0, 0, 0, 0, 0]
  let starCount_ = 0
  for (let i = 0; i < cardArr.length; i++) {
    let star = cardArr[i].star - 1
    starArr[star] = starArr[star] + 1
    starCount_ = starCount_ + star + 1
  }
  return [starArr, starCount_]
}
// 统计水晶
exports.cryCount = function (cardArr) {
  let cryArr = [0, 0, 0, 0, 0]
  for (let i = 0; i < cardArr.length; i++) {
    let cry = cardArr[i].cry - 1
    cryArr[cry] = cryArr[cry] + 1
  }
  return cryArr
}
// 统计攻防速血
exports.setADSHP = function (
  cardArr,
  starArr,
  starCount,
  cryArr,
  cardIndexCount,
  cardLevel
) {
  let x = starCount //初始化x为星星的数量
  // 如果是1、2、3、4、5、6顺子排列的卡牌则攻击力和防御力和血的x+20
  let minStarCount = Math.min.apply(null, starArr)
  if (minStarCount > 2) {
    minStarCount = 2
  }
  let cardCountPlus = Math.floor(cardIndexCount / 25) //每25收集率x+1
  x = x + minStarCount * 20 + cardCountPlus
  // 每三种同属性的卡牌攻击力和防御力和血的x+1
  // 同属性加成废止
  // for(let i=0;i<cryArr.length;i++){
  //     let cryPlusX = Math.floor(cryArr[i]/3);
  //     x = x + cryPlusX;
  // }
  // 攻击=x*100 防=x*50 血=x*200
  let A = x * 100
  let D = x * 50
  let HP = x * 1150
  // 设置速度
  let S = 0
  for (let j = 0; j < cardArr.length; j++) {
    //速4
    let leftType = cardArr[j].leftType
    let level = cardLevel[cardArr[j].cardId] || 0
    if (leftType === 4) {
      S = S + 1 + level * 1
    } else if (leftType === 1) {
      //全1
      A = A + 50 + level * 50
      D = D + 25 + level * 25
    } else if (leftType === 2) {
      //兵2
      A = A + 100 + level * 100
    } else if (leftType === 3) {
      //盾3
      D = D + 50 + level * 50
    } else if (leftType === 5) {
      //爱5
      HP = HP + 1150 + level * 1150
    }
  }
  return [A, D, S, HP]
}
// 设置AI卡牌
exports.creatAICard = function (starArr_, allCardDataArr) {
  let cardArr = []
  let starArr = [...starArr_]
  for (let i = 0; i < starArr.length; i++) {
    // 如果该星级卡牌大于0张则开始分配卡牌
    if (starArr[i] > 0) {
      const starCard = allCardDataArr[i + 1]
      const randomCardData = utils.randomArray(starCard, starArr[i])
      // 循环获取卡牌ID
      for (let j = 0; j < randomCardData.length; j++) {
        cardArr.unshift(randomCardData[j].cardId)
      }
    }
  }
  return cardArr
}
// 统计总COST
exports.countCost = function (level, cardList) {
  let cost = 0
  Object.keys(level).forEach((key) => {
    const leftType = cardList.find((element) => element.cardId === key).leftType
    for (let i = 0; i < level[key]; i++) {
      cost = cost + this.setCostShould(leftType, i)
    }
  })
  return cost
}
// AI卡牌COST
exports.setCostShould = function (leftType, level = 0) {
  let addCoe = 0
  if (level > 20) {
    //假如等级大于20则需要的矿石数量会增加
    addCoe = level - 20
  }
  let itemCount = 0
  if (leftType == 1) {
    const itemCountBase = 45
    itemCount = itemCountBase + (itemCountBase / 5) * addCoe
  } else if (leftType == 2) {
    const itemCountBase = 60
    itemCount = itemCountBase + (itemCountBase / 5) * addCoe
  } else if (leftType == 3) {
    const itemCountBase = 30
    itemCount = itemCountBase + (itemCountBase / 5) * addCoe
  } else if (leftType == 4) {
    const itemCountBase = 60
    itemCount = itemCountBase + (itemCountBase / 5) * addCoe
  } else if (leftType == 5) {
    const itemCountBase = 345
    itemCount = itemCountBase + (itemCountBase / 5) * addCoe
  }
  return Math.round(itemCount)
}
// 设置AI卡牌等级
exports.creatAILevel = function (cardList, cost) {
  let allCost = cost
  let level = {}
  while (allCost > 25) {
    const addLevelCard = cardList[utils.randomNum(0, 19)]
    let cardLevel = (level[addLevelCard.cardId] || 0) + 1
    level[addLevelCard.cardId] = cardLevel
    allCost = allCost - this.setCostShould(addLevelCard.leftType, cardLevel)
  }
  return level
}
// 获取所有卡牌
exports.getAllCardInfo = async function () {
  let allCardArr = []
  const allCardData = await cardData
    .findCardDataMany({}, '-__v -_id')
    .catch((err) => {
      throw err
    })
  allCardArr[0] = [...allCardData]
  // 卡牌星级分类
  allCardArr[1] = allCardArr[0].filter((item) => item.star === 1)
  allCardArr[2] = allCardArr[0].filter((item) => item.star === 2)
  allCardArr[3] = allCardArr[0].filter((item) => item.star === 3)
  allCardArr[4] = allCardArr[0].filter((item) => item.star === 4)
  allCardArr[5] = allCardArr[0].filter((item) => item.star === 5)
  allCardArr[6] = allCardArr[0].filter((item) => item.star === 6)
  return allCardArr
}
