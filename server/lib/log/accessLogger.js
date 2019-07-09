const log4js = require("log4js");
const logger = require("./logger").access;

module.exports = (options) => {
  options = options || {}; // オプションを指定する場合はそちらを使う
  options.level = options.level || "auto"; // ない場合、autoを設定
  return log4js.connectLogger(logger, options); // ログ設定 Expressのアクセスログと結びつける
};