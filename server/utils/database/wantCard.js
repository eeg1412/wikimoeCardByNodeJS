var wantCardModel = require('../../models/wantCard');
exports.findOneAndUpdate = async function (conditions, update) {
    let options = {
        upsert: true
    }
    return await wantCardModel.findOneAndUpdate(conditions, update, options);
}
exports.findWantCard = async function (pageSize_, page_, parmas, getParams) {
    // document查询
    let pageSize = pageSize_;
    let page = isNaN(Math.round(page_)) ? 1 : Math.round(page_);
    let query = wantCardModel.find(parmas, getParams).sort({ 'time': -1 });
    let total = await query.countDocuments();
    let data = await query
        .find()
        .skip(pageSize * (page - 1))
        .limit(pageSize);
    return [data, total];
}
exports.updatatWantMany = async function (filters, parmas) {
    // document查询
    return await wantCardModel.updateMany(filters, parmas);
}
exports.deletWantMany = async function (parmas) {
    // document查询
    return await wantCardModel.deleteMany(parmas);
}
exports.getPackageCount = async function (match) {
    const group = await wantCardModel.aggregate([
        {
            $match: match
        },
        {
            $group: {
                _id: "$packageId",
                count: {
                    $sum: 1
                }
            }
        }
    ]
    );
    return group;
}
exports.getGroup = async function (cardArr) {
    const group = await wantCardModel.aggregate([
        {
            $match: {
                cardId: { $in: cardArr }
            }
        },
        {
            $group: {
                _id: "$cardId",
                count: {
                    $sum: 1
                }
            }
        }
    ]
    );
    return group;
}