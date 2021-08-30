const statisticsModel = require('@mongoMODs/user/statistics')

exports.save = async function (parmas) {
  // document作成
  const statisticsData = new statisticsModel(parmas)
  // document保存
  return await statisticsData.save()
}

exports.findOne = async function (parmas) {
  // document查询
  return await statisticsModel.findOne(parmas)
}

exports.updateOne = async function (filters, parmas) {
  // document查询
  return await statisticsModel.updateOne(filters, parmas)
}
