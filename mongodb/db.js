var mongoose = require('mongoose')
var chalk = require('chalk')

const DBStart = () => {
  return new Promise((resolve, reject) => {
    mongoose.connect(
      process.env.DB_HOST || 'mongodb://localhost:27017/mevntest',
      {
        useNewUrlParser: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
      }
    )
    mongoose.Promise = global.Promise
    const db = mongoose.connection

    db.once('open', () => {
      console.info(chalk.green('连接数据库成功'))
      global.DBIsStart = true
      resolve(db)
    })

    db.on('error', function (error) {
      global.DBIsStart = false
      reject(error)
      console.error(chalk.red('Error in MongoDb connection: ' + error))
      console.error(chalk.red('数据库连接失败'))
      mongoose.disconnect()
      throw '数据库连接失败'
    })

    db.on('close', function () {
      global.DBIsStart = false
      console.error(chalk.red('数据库被断开'))
      throw '数据库被断开'
    })
  })
}

module.exports = DBStart
