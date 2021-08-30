const itemInfosModel = require('@mongoMODs/user/itemInfos')

exports.save = async function (parmas) {
  // document作成
  const itemInfosData = new itemInfosModel(parmas)
  // document保存
  return await itemInfosData.save()
}

exports.findOne = async function (parmas) {
  // document查询
  return await itemInfosModel.findOne(parmas)
}

exports.updateOne = async function (filters, parmas) {
  // document查询
  return await itemInfosModel.updateOne(filters, parmas)
}
