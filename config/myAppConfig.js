const fs = require('fs')
const configData = () => {
  let baseConfig = {
    dailyChance: 5, //每日抽卡次数
    browserTitle: '维基萌抽卡', //浏览器标签标题
    siteTitle: '维基萌抽卡', //网站标题
  }
  let myConfig = {}
  const configPath = './config/config.json'
  if (fs.existsSync(configPath)) {
    myConfig = fs.readFileSync(configPath, 'utf8')
    myConfig = JSON.parse(myConfig)
  }
  return Object.assign(baseConfig, myConfig)
}
module.exports = configData
