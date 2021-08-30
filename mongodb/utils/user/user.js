const usersModel = require('@mongoMODs/user/users')

exports.save = async function (parmas) {
  // document作成
  const userData = new usersModel(parmas)
  // document保存
  return await userData.save()
}

exports.findOne = async function (parmas) {
  // document查询
  return await usersModel.findOne(parmas).populate('battleInfo', 'deminingInfo', 'guessCardInfo', 'itemInfo', 'daliyGetItemInfo', 'statistics', 'userCard')
}

exports.updateOne = async function (filters, parmas) {
  // document查询
  return await usersModel.updateOne(filters, parmas)
}
