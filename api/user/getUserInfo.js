const utils = require("@utils");

module.exports = async function (req, res, next) {
  const token = req.header("token");
  const playerInfo = await utils.checkTokenAndAccount(token);
  if (playerInfo) {
    res.send({
      code: 1,
      msg: "ok！",
      playerInfo: playerInfo
    });
  } else {
    res.send({
      code: 403,
      msg: "token认证失败！",
      playerInfo: playerInfo
    });
  }
};
