const daliyGetItemInfosModel = require('@mongoMODs/user/daliyGetItemInfos')

exports.save = async function (parmas) {
  // document作成
  const daliyGetItemInfosData = new daliyGetItemInfosModel(parmas)
  // document保存
  return await daliyGetItemInfosData.save()
}

exports.findOne = async function (parmas) {
  // document查询
  return await daliyGetItemInfosModel.findOne(parmas)
}

exports.updateOne = async function (filters, parmas) {
  // document查询
  return await daliyGetItemInfosModel.updateOne(filters, parmas)
}
