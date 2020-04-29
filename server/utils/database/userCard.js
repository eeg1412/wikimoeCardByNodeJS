var userCardModel = require('../../models/v3/userCard');
const userStatistics = require('./userStatistics');
exports.findOneAndUpdate = async function (conditions, update) {
    let options = {
        upsert: false
    }
    return await userCardModel.findOneAndUpdate(conditions, update, options);
}
exports.updateOne = async function (filters, parmas, cardIndexCountId = null) {
    // document查询
    const dataRes = await userCardModel.updateOne(filters, parmas);
    if (cardIndexCountId) {
        const count = await userCardModel.aggregate([
            { $unwind: "$cardList" },
            {
                $group: {
                    _id: "$cardList.cardID",
                    count: {
                        $sum: 1
                    }
                }
            }
        ])
        const cardIdCount = count.length;
        await userStatistics.updateOne({ _id: cardIndexCountId }, { cardIndexCount: cardIdCount });
    }
    return dataRes;
}
exports.findOne = async function (parmas) {
    return await userCardModel.findOne(parmas);
}

exports.save = async function (parmas) {
    // document作成
    var newData = new userCardModel(parmas);
    // document保存
    return await newData.save()
}