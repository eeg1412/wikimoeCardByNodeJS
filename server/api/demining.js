var utils = require('../utils/utils');
var deminingModel = require('../models/demining');
var md5 = require('md5-node');
var userData = require('../utils/database/user');
var itemDatabase = require('../utils/database/item');
var chalk = require('chalk');
var mapData = require('../data/deminingMap.json');

var mineSweepingMap = function (returnData) {
    //20,30
    let randomRowsCols = utils.randomNum(20,25);
    let r = randomRowsCols;
    let c = randomRowsCols;
    //40,80
    let num = utils.randomNum(40,80);
    var map = []
    // 给行数，生成一个 1 维数组
    var row = function (r) {
        for (var i = 0; i < r; i++) {
            map[i] = new Array()
        }
    }
    // 给列数，生成一个 2 维数组
    var column = function (col) {
        for (var i = 0; i < map.length; i++) {
            for (var j = 0; j < col; j++) {
                map[i][j] = 0
            }
        }
    }
    // 给列数和行数生成空地图
    var blankMap = function (r, col) {
        row(r)
        column(col)
    }

    // 给出地雷数量让后随机写入地雷
    var writeInMine = function (num) {
        // 随机位置写入
        var randomLocation = function () {
            var x = Math.floor(Math.random() * r)
            var y = Math.floor(Math.random() * c)
            // console.log( ':', x, y);
            if (map[x][y] !== 9) {
                map[x][y] = 9
            } else {
                randomLocation()
            }
        }
        for (var i = 0; i < num; i++) {
            randomLocation()
        }
    }

    // 使用循环给雷的边上所有数 +1 , 已经是雷的除外
    var plus = function (array, x, y) {
        if (x >= 0 && x < r && y >= 0 && y < c) {
            if (array[x][y] !== 9) {
                array[x][y] += 1
            }
        }
    }
    var writeInHint = function () {
        for (var x = 0; x < map.length; x++) {
            for (var y = 0; y < map[0].length; y++) {
                if (map[x][y] === 9) {
                    // 上下 6 个
                    for (var i = -1; i < 2; i++) {
                        plus(map, x - 1, y + i)
                        plus(map, x + 1, y + i)
                    }
                    // 左右 2 个
                    plus(map, x, y + 1)
                    plus(map, x, y - 1)
                }
            }
        }
    }

    blankMap(r, c)
    writeInMine(num)
    writeInHint()
    let time = Math.round(new Date().getTime()/1000);
    let randomMapType  = utils.randomNum(1,17)
    let data = {
        map:map,
        creatTime:time,
        mapType:randomMapType,
        boomNum:num,
        boomedNum:0,
        rows:r,
        cols:c,
        player:null,
        close:0
    }
    // document作成
    var demining = new deminingModel(data);

    // document保存
    demining.save(function(err) {
        if (err) throw err;
        
    });
    if(returnData){
        delete data.boomedNum;
        delete data.boomNum;
        delete data.map;
        // console.log(data);
        return data
    }
}

var getMineMap = function(socket,cast){
    deminingModel.findOne({ close: 0 },'-_id creatTime mapType rows cols player close', (err, result)=> {
        if (err) {
            socket.emit('demining',{code:1,msg:'内部错误请联系管理员！'});
            throw err;
        }else{
            //判断是否有数据
            if(result){
                let resData = {
                    data:result,
                    code:0
                };
                socket.emit('demining',resData);
                // if(cast){
                //     socket.broadcast.emit('demining',resData);
                // }
            }else{
                let mineData = mineSweepingMap(true);
                let resData = {
                    data:mineData,
                    code:0
                };
                socket.emit('demining',resData);
                if(cast){
                    socket.broadcast.emit('demining',resData);
                }
            }
        }
    });
}
var openNode = function(socket,data,result_){
    deminingModel.findOne({ close: 0 }, async (err, result)=> {
        if (err) {
            socket.emit('demining',{code:1,msg:'内部错误请联系管理员！'});
            throw err;
        }else{
            //判断是否有数据
            if(result){
                let x = Math.round(data.x) || 0;
                let y = Math.round(data.y) || 0;
                if(result.player){
                    // 判断是否被人挖
                    if(result.player[y+'_'+x]){
                        socket.emit('demining',{code:1,msg:'此处已经被人抢先！',time:data.time});
                        return false;
                    }
                }
                // 判断矿场时间戳是否对的上
                if(result.creatTime!=data.creatTime){
                    socket.emit('demining',{code:1,msg:'矿场不正确，请刷新查看！',time:data.time});
                    console.info(chalk.yellow('错误的矿场时间戳'))
                    return false;
                }
                let playData = result.player;
                let demNum = null;
                try {
                    demNum = result.map[y][x];
                }catch(err) {
                    socket.emit('demining',{code:1,msg:'矿场不正确，请刷新查看！',time:data.time});
                    console.info(chalk.yellow('矿场x,y有误！'))
                    return false;
                }
                let boomedNum = result.boomedNum;
                let boomNum = result.boomNum;
                let close = result.close;
                let starAdd = 0;
                let useTool = data.tool;
                let getItem = null;
                let getItemNum = 0;
                if(demNum===undefined||demNum===null){
                    socket.emit('demining',{code:1,msg:'矿场不正确，请刷新查看！',time:data.time});
                    console.info(chalk.yellow('错误的矿场坐标'))
                    return false;
                }
                if(playData===null){
                    playData = {};
                }
                playData[y+'_'+x] = {
                    md5:md5(data.email),
                    num:demNum
                };
                if(demNum==9){
                    boomedNum = boomedNum +1;
                    if(useTool==0){
                        starAdd = utils.randomNum(1,4);
                    }else if(useTool==1){
                        starAdd = utils.randomNum(5,15);
                    }else if(useTool==2){
                        starAdd = utils.randomNum(20,30);
                    }
                }else{
                    let itemRare = utils.randomNum(1,100);//随机一个随机道具因子
                    let mapType = result.mapType;
                    if(itemRare>=80){//20%概率地图稀有道具
                        let itemList = mapData[mapType].low;
                        getItem = itemList[utils.randomNum(0,itemList.length-1)];
                    }else{//80%概率地图常见道具
                        let itemList = mapData[mapType].high;
                        getItem = itemList[utils.randomNum(0,itemList.length-1)];
                    }
                    getItemNum = utils.randomNum(1,demNum+1);//获得道具数量
                }
                if(boomedNum>=boomNum){
                    close = 1;
                }
                if(demNum==9&&close===1){//如果是最后一矿且挖到矿了*3的矿
                    starAdd = starAdd*3;
                    console.info(chalk.green('当前为最后一片矿，三倍出矿，总出矿：'+starAdd))
                }
                let timeNow = Math.round(new Date().getTime()/1000);
                let filters = {
                    email:data.email
                }
                let deminingTool = result_.deminingStamp;
                let addToolTime = 0;
                if(useTool==0){
                    addToolTime = 60*10;
                }else if(useTool==1){
                    addToolTime = 60*30;
                }else if(useTool==2){
                    addToolTime = 60*60;
                }else{
                    socket.emit('demining',{code:1,msg:'稿子参数不对！',time:data.time});
                    console.info(chalk.yellow('使用错误的稿子参数'))
                    return false;
                }
                deminingTool[useTool] =  timeNow + addToolTime;
                let levle = result_.level;
                let getExp = 10+demNum+starAdd;
                let exp = result_.exp+getExp;
                let levelExp = utils.levelCheck(levle,exp);
                let levelUpStar = levelExp[2]*30;
                let params = {
                    $inc:{
                        star:starAdd + levelUpStar,
                        deminingStarCount:starAdd
                    },
                    deminingStamp:deminingTool,
                    level:levelExp[0],
                    exp:levelExp[1],
                    ip:data.IP
                };
                let md5Email = md5(data.email);
                await userData.updataUser(filters,params).catch ((err)=>{
                    socket.emit('demining',{code:1,msg:'内部错误请联系管理员！',time:data.time});
                    console.error(
                        chalk.red('数据库更新错误！')
                    );
                    throw err;
                })
                if(demNum<9){//如果没挖到星星则写入道具数据库
                    let conditions = {
                        email:data.email
                    }
                    let getItemObj = {};
                    getItemObj['item.'+getItem] = getItemNum;
                    let update_ = {
                        $inc:getItemObj
                    }
                    await itemDatabase.findOneAndUpdate(conditions,update_).catch ((err)=>{
                        socket.emit('demining',{code:1,msg:'内部错误请联系管理员！',time:data.time});
                        console.error(
                            chalk.red('数据库更新错误！')
                        );
                        throw err;
                    })
                }
                console.info(
                    chalk.green(data.email+'用工具'+useTool+'挖掘了['+x+','+y+']，其结果为：'+demNum+'，共获得星星'+starAdd+'颗，'+'IP为：'+data.IP)
                )
                deminingModel.updateOne({close: 0}, {player:playData,boomedNum:boomedNum,close:close}, (err, docs)=>{
                    if(err) {
                        socket.emit('demining',{code:1,msg:'内部错误请联系管理员！',time:data.time});
                        throw err;
                    }else{
                        if(starAdd>0){
                            socket.emit('demining',{code:2,star:starAdd,demNum:demNum,time:data.time,x:x,y:y,md5:md5Email,close:close,levelUpStar:levelUpStar});
                            let logObject = {
                                email:data.email,
                                md5:md5Email,
                                nickName:result_.nickName,
                                type:'demining',
                                time:timeNow,
                                data:{
                                    star:starAdd,
                                    pickaxe:useTool,
                                    exp:getExp,
                                    x:x,
                                    y:y
                                },
                                ip:data.IP
                            }
                            utils.writeLog(logObject);
                        }else{
                            socket.emit('demining',{code:201,demNum:demNum,time:data.time,x:x,y:y,md5:md5Email,levelUpStar:levelUpStar,getItem:getItem,getItemNum:getItemNum});
                        };
                        // 广播挖矿信息
                        if(close){
                            deminingModel.deleteMany({close:1}, (err)=> {
                                if(err){
                                    socket.emit('demining',{code:1,msg:'内部错误请联系管理员！',time:data.time});
                                    console.error(
                                        chalk.red('数据库更新错误！')
                                    );
                                    console.error(
                                        chalk.red(err)
                                    );
                                }
                                console.info(
                                    chalk.green('删除已关闭矿场')
                                )
                            });
                            getMineMap(socket,true);
                        }else{
                            socket.broadcast.emit('demining',{code:5,demNum:demNum,x:x,y:y,md5:md5Email});
                        }
                        let userData = {
                            star:result_.star+starAdd,
                            md5:result_.md5,
                            nickName:result_.nickName,
                            deminingStamp:deminingTool,
                            timeNow:timeNow
                        };
                        sendUserData(socket,userData);
                    }
                });
            }else{
                socket.emit('demining',{code:1,msg:'内部错误请联系管理员！',time:data.time});
            }
        }
    });
}
var sendUserData = function(socket,userData){
    socket.emit('demining',{
        code:3,
        msg:'ok',
        userData:userData
    });
}
exports.mine = async function(socket,data){
    let IP = '';
    let timeNow = Math.round(new Date().getTime()/1000);
    if(socket.handshake.headers['x-forwarded-for'] != null){
        IP = socket.handshake.headers['x-forwarded-for'];
    }else{
        IP = socket.handshake.address;
    }
    IP = IP.match(/\d+.\d+.\d+.\d+/);
    IP = IP ? IP.join('.') : 'No IP';
    data.IP = IP;
    console.info(
        chalk.green(IP+'连接挖矿服务器。')
    )
    let token = data.token;
    if(token){
        let result = await utils.tokenCheckAndEmail(token).catch ((err)=>{
            throw err;
        });
        if(!result){
            socket.emit('demining',{code:403,msg:'账户信息已失效，请重新登录！',time:data.time});
            console.info(
                chalk.yellow('查询结果无该用户,IP为：'+IP)
            );
            return false;
        }
        data.email = result.email;
        console.info(
            chalk.green(IP+'的邮箱解析结果为'+data.email)
        )
        //开始处理挖矿逻辑
        if(data.type=='get'){
            console.info(
                chalk.green(data.email+'获取挖矿地图')
            );
            getMineMap(socket,false);
            let userData = {
                star:result.star,
                md5:result.md5,
                nickName:result.nickName,
                deminingStamp:result.deminingStamp,
                timeNow:timeNow
            };
            sendUserData(socket,userData);
        }else if(data.type=='open'){
            data.tool = (data.tool&&data.tool<=2)?data.tool:0;
            let useTool = data.tool;
            if(timeNow<Number(result.deminingStamp[useTool])){
                console.info(
                    chalk.yellow(data.email+'的工具'+useTool+'还在冷却。'+'IP为：'+data.IP)
                )
                socket.emit('demining',{code:4,msg:'您选择的工具还在制作中！',time:data.time});
                let userData = {
                    star:result.star,
                    md5:result.md5,
                    nickName:result.nickName,
                    deminingStamp:result.deminingStamp,
                    timeNow:timeNow
                };
                sendUserData(socket,userData);
                return false;
            }
            openNode(socket,data,result);
        }  
    }else{
        console.info(
            chalk.yellow(data.email+'参数有误！')
        );
        socket.emit('demining',{code:403,msg:'账户信息已失效，请重新登录！'});
        return false;
    }
}