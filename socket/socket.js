
const utils = require('../utils/utils');

module.exports = (io) => {
    // console.log(io);
    const chat = io
        .of('/socketchat')
        .on('connection', function (socket) {
            if (!socket["userData"]) {
                socket.emit('logout');
                socket.disconnect();
            } else {
                socket.on('send', (data) => {
                    const sendData = {
                        msg: data,
                        account: socket["userData"].account
                    }
                    chat.emit('msg', sendData);
                });
            }
        });
    chat.use(async (socket, next) => {
        let token = socket.handshake.query.token;
        if (!token) {
            return next(new Error('authentication error'));
        }
        userData = await utils.checkTokenAndAccount(token);
        socket["userData"] = userData;
        return next();
    });
};