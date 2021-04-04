var utils = require('../utils/utils')
const _ = require('lodash')
const validator = require('validator')
exports.login = async function (token, socket) {
    let IP = ''
    if (socket.handshake.headers['x-forwarded-for'] != null) {
        IP = socket.handshake.headers['x-forwarded-for']
    } else {
        IP = socket.handshake.address
    }
    IP = IP.match(/\d+.\d+.\d+.\d+/)
    IP = IP ? IP.join('.') : 'No IP'
    let backData = {
        status: false,
        IP: IP,
    }
    if (token) {
        // 验证用户信息
        let result = await utils.tokenCheckAndEmail(token).catch((err) => {
            throw err
        })
        // 如果验证成功
        if (result) {
            backData = {
                status: true,
                userInfo: result,
                IP: IP,
            }
        }
    }
    return backData
}
exports.searchUser = async (socket, data) => {
    // 查找在线用户
    let page = 1
    if (data) {
        page = data.page || 1
    }
    const userDataCount = _.groupBy(global.onlinePlayer, (value) => {
        return value.email
    })
    if (!validator.isInt(page + '', { min: 1 })) {
        page = 1
    }
    const pagination = function (pageSize, currentPage, arr) {
        var skipNum = (currentPage - 1) * pageSize
        var newArr =
            skipNum + pageSize >= arr.length
                ? arr.slice(skipNum, arr.length)
                : arr.slice(skipNum, skipNum + pageSize)
        return newArr
    }
    const pushBy = function (group) {
        var list = []
        group.forEach((item) => {
            list.push(item.device)
        })
        return list
    }
    let pageUser = _.map(userDataCount, (item) => {
        return {
            md5: item[0].md5,
            nickName: item[0].nickName,
            loginTime: item[0].loginTime,
            deviceList: pushBy(item),
        }
    })
    pageUser = pagination(5, page, pageUser)
    socket.emit('searchUserRes', {
        code: 900,
        pageUser: pageUser,
        userTotal: Object.keys(userDataCount).length,
    })
}