import { Loading } from 'element-ui';

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

//接口加载
let loadingCount = 0;
let loading;

const startLoading = () => {
  loading = Loading.service({
    background:'rgba(255,255,255,0)',
    text:'努力加载中...',
    spinner:'el-icon-loading'
  });
};

const endLoading = () => {
  loading.close();
};

export const showLoading = () => {
  if (loadingCount === 0) {
    startLoading();
  }
  loadingCount += 1;
};

export const hideLoading = () => {
  if (loadingCount <= 0) {
    return;
  }
  loadingCount -= 1;
  if (loadingCount === 0) {
    endLoading();
  }
};

//跳转到顶部
export const scrollToTop = (number = 0, time) => {
  if (!time) {
    document.body.scrollTop = document.documentElement.scrollTop = number;
    return number;
  }
  const spacingTime = 20; // 设置循环的间隔时间  值越小消耗性能越高
  let spacingInex = time / spacingTime; // 计算循环的次数
  let nowTop = document.body.scrollTop + document.documentElement.scrollTop; // 获取当前滚动条位置
  let everTop = (number - nowTop) / spacingInex; // 计算每次滑动的距离
  let scrollTimer = setInterval(() => {
      if (spacingInex > 0) {
          spacingInex--;
          scrollToTop(nowTop += everTop);
      } else {
          clearInterval(scrollTimer); // 清除计时器
      }
  }, spacingTime);
};
