const deminingInfosModel = require('@mongoMODs/user/deminingInfos')

exports.save = async function (parmas) {
  // document作成
  const deminingInfosData = new deminingInfosModel(parmas)
  // document保存
  return await deminingInfosData.save()
}

exports.findOne = async function (parmas) {
  // document查询
  return await deminingInfosModel.findOne(parmas)
}

exports.updateOne = async function (filters, parmas) {
  // document查询
  return await deminingInfosModel.updateOne(filters, parmas)
}
