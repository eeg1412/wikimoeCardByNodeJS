const userCardsModel = require('@mongoMODs/user/userCards')

exports.save = async function (parmas) {
  // document作成
  const userCardsData = new userCardsModel(parmas)
  // document保存
  return await userCardsData.save()
}

exports.findOne = async function (parmas) {
  // document查询
  return await userCardsModel.findOne(parmas)
}

exports.updateOne = async function (filters, parmas) {
  // document查询
  return await userCardsModel.updateOne(filters, parmas)
}
