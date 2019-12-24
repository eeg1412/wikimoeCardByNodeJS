var fs = require('fs');

// 计算本月有多少天
exports.getDaysInMonth = function(month,year) {
    return new Date(year, month, 0).getDate();
}
// 写入新的每日道具
exports.creatNewItemList = function(month,year) {
    let days = this.getDaysInMonth(month,year);
    let dailyObj = {};
    let items = [];
    for(let i=0;i<days;i++){
        let getItem = {};
        if(i===0){//每月1日
            getItem = {
                item:"star",
                num:30,
                text:"星星×30"
            }
        }else if(i===4){ // 每月5号
            getItem = {
                item:"400",
                num:2,
                text:"星星镐×2"
            }
        }else if(i===9){ // 每月10号
            getItem = {
                item:"401",
                num:3,
                text:"宝石镐×3"
            }
        }else if(i===14){//每月15日
            getItem = {
                item:"star",
                num:300,
                text:"星星×300"
            }
        }else if(i===19){ // 每月20号
            getItem = {
                item:"402",
                num:3,
                text:"保罗炸弹×3"
            }
        }else if(i===(days-2)){//每月倒数第二天
            getItem = {
                item:"star",
                num:600,
                text:"星星×600"
            }
        }else if(i===(days-1)){//每月最后一日
            getItem = {
                item:"200",
                num:1,
                text:"等级转换卷轴×1"
            }
        }else{
            getItem = {
                item:"radomItem",
                num:10+i,
                text:"随机宝石×"+(10+i)
            }
        }
        items.push(getItem);
    }
    dailyObj['time'] = new Date().getTime();
    dailyObj['item'] = items;
    // 更新文件
    let items_ = JSON.stringify(dailyObj);
    fs.writeFileSync('./config/cache/dailyGetItem.json', items_, 'utf8');
    return items_;
}