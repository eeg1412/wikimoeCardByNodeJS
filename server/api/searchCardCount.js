var utils = require('../utils/utils');
const user = require('../utils/database/user')
module.exports = async function (req, res, next) {
    const token = req.body.token;
    const md5 = req.body.md5;

    const cardCount = {};
    // 如果有Token则统计该用户下的所有卡牌计数
    if (token) {
        let userInfo = await utils.tokenCheckAndEmail(token).catch((err) => {
            throw err;
        });
        if (userInfo) {
            const card = userInfo.card || {};
            Object.keys(card).forEach((packageId) => {
                const cardObj = card[packageId];
                cardCount[packageId] = Object.keys(cardObj).length;
            });
        }
    } else if (md5) {
        let userInfo = await user.findUser({ md5: md5 }).catch((err) => {
            throw err;
        });
        if (userInfo) {
            const card = userInfo.card || {};
            Object.keys(card).forEach((packageId) => {
                const cardObj = card[packageId];
                cardCount[packageId] = Object.keys(cardObj).length;
            });
        }
    }
    res.send({
        code: 1,
        cardCount: cardCount,
        msg: 'ok！'
    });
}