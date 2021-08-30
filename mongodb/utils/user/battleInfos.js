const battleInfosModel = require('@mongoMODs/user/battleInfos')

exports.save = async function (parmas) {
  // document作成
  const battleInfosData = new battleInfosModel(parmas)
  // document保存
  return await battleInfosData.save()
}

exports.findOne = async function (parmas) {
  // document查询
  return await battleInfosModel.findOne(parmas)
}

exports.updateOne = async function (filters, parmas) {
  // document查询
  return await battleInfosModel.updateOne(filters, parmas)
}
