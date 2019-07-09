const path = require('path');
// ログ出力先は、サーバー内の絶対パスを動的に取得して出力先を設定したい
const APP_ROOT = path.join(__dirname, '../');

// ログ出力設定
module.exports = {
  appenders: {
    consoleLog: {
      type: 'console',
    },
    applicationLog: {
      type: "multiFile",
      base: path.join(APP_ROOT, "./log/application/"),
      property: "key",
      extension: ".log",
      maxLogSize: 5000000,
      backups: 5,
      compress: true,
    },
    // ADD
    accessLog: {
      type: "dateFile",
      filename: path.join(APP_ROOT, "./log/access/access.log"),
      pattern: "yyyy-MM-dd", // 日毎にファイル分割
      daysToKeep: 5, // 5日分の世代管理設定
      compress: true,
      keepFileExt: true,
    }
  },
  categories: {
    default: {
      appenders: ["consoleLog"],
      level: "ALL"
    },
    application: {
      appenders: ["applicationLog"],
      level: "ALL"
    },
    // ADD
    access: {
      appenders: ["accessLog"],
      level: "ALL"
    }
  },
};