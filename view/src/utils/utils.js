export const mailCheck = function(email){
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}
//检查密码格式
export const passwordCheck = function (password) {
    return /^\d{4,8}$/.test(password)//4-8位纯数字
}
//检查昵称格式
export const nickNameCheck = function (nickName) {
    return /^[\u4E00-\u9FA5\u0800-\u4e00A-Za-z0-9_]{2,8}$/.test(nickName)//2-8位中文、日文、英文、数字包括下划线
}
//数字补充0
export const PrefixInteger = function(num, length) {
    if((num+'').length>length){
        return num+'';
    }
    return (Array(length).join('0') + num).slice(-length);
}
//检查MD5
export const md5Check = function (MD5) {
    return /^[A-Za-z0-9]{32}$/.test(MD5)//32位MD5
}
//读图
export const loadingImg = function(imgSrcArr,resolve_,reject_){
    var imgLength = imgSrcArr.length;
    var proArr = [];
    let images = [];
    for(var i=0;i<imgLength;i++){
        proArr[i] = new Promise( (resolve, reject) => {
            images[i] = new Image();
            images[i].src = imgSrcArr[i];
            images[i].onload = function(){
                resolve('ok');
            };
            images[i].onerror = function(){
                reject('err');
            }
        })
    }
    Promise.all(proArr).then( (results) => {
        console.log(results);
        resolve_('img all ok');
    }).catch( (reason) => {
        reject_(reason);
    });
}