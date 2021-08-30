const guessCardInfosModel = require('@mongoMODs/user/guessCardInfos')

exports.save = async function (parmas) {
  // document作成
  const guessCardInfosData = new guessCardInfosModel(parmas)
  // document保存
  return await guessCardInfosData.save()
}

exports.findOne = async function (parmas) {
  // document查询
  return await guessCardInfosModel.findOne(parmas)
}

exports.updateOne = async function (filters, parmas) {
  // document查询
  return await guessCardInfosModel.updateOne(filters, parmas)
}
