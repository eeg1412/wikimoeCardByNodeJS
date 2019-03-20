//获取用户IP
exports.getUserIp = function (req) {
    let ip =  req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress || '';
    ip = ip.match(/\d+.\d+.\d+.\d+/);
    ip = ip ? ip.join('.') : 'No IP';
    return ip;
};
//检查邮箱地址格式
exports.emailCheck = function (email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}
//检查密码格式
exports.passwordCheck = function (password) {
    return /^\d{4,8}$/.test(password)//4-8位纯数字
}
//检查昵称格式
exports.nickNameCheck = function (nickName) {
    return /^[\u4E00-\u9FA5\u0800-\u4e00A-Za-z0-9_]{2,8}$/.test(nickName)//2-8位中文、日文、英文、数字包括下划线
}
//检查MD5
exports.md5Check = function (MD5) {
    return /^[A-Za-z0-9]{32}$/.test(MD5)//32位MD5
}
//区间内随机整数
exports.randomNum = function (n,m) {
    var random = Math.floor(Math.random()*(m-n+1)+n);
    return random;
}
//数组去重
exports.unique = function(arr){
    if (!Array.isArray(arr)) {
        return arr;
    }
    if (arr.length < 2) {
        return arr;
    }
    return Array.from(new Set(arr))
}
//数字补充0
exports.PrefixInteger = function(num, length) {
    if((num+'').length>length){
        return num+'';
    }
    return (Array(length).join('0') + num).slice(-length);
}
//随机抽卡
exports.wmCreatCardId = function($randomCardRate){
    $randomCardID = null;
    if($randomCardRate>=1&&$randomCardRate<=64){
        //N
        $randomCardN_ = this.randomNum(1, 97);
        $randomCardID = $randomCardN_+'';
    }else if($randomCardRate>=65&&$randomCardRate<=86){
        //R
        $randomCardR_ = this.randomNum(1, 81);
        $randomCardID = '1'+this.PrefixInteger($randomCardR_,3);
    }else if($randomCardRate>=87&&$randomCardRate<=97){
        //SR
        $randomCardSR_ = this.randomNum(1, 65);
        $randomCardID = '2'+this.PrefixInteger($randomCardSR_,3);
    }else if($randomCardRate>97){
        //SSR
        $randomCardSSR_ = this.randomNum(1, 34);
        $randomCardID = '3'+this.PrefixInteger( $randomCardSSR_,3);
    }
    return $randomCardID;
}