import { Loading, Message } from 'element-ui';
//卡包排序
export const packageSort = function (cardPackage, sort, sortType) {
    let cardPackage_ = cardPackage;
    console.log(cardPackage, sort);
    const sortInfoRaw = sort.find((item) => item.type === sortType);
    if (sortInfoRaw) {
        const sortInfo = sortInfoRaw.packageSortList;
        cardPackage_.sort((a, b) => {
            if (sortInfo.indexOf(a._id) === -1 && sortInfo.indexOf(b._id) === -1) {
                return 1
            } else if (sortInfo.indexOf(a._id) !== -1 && sortInfo.indexOf(b._id) === -1) {
                return -1
            } else if (sortInfo.indexOf(a._id) === -1 && sortInfo.indexOf(b._id) !== -1) {
                return 1
            }
            return sortInfo.indexOf(a._id) - sortInfo.indexOf(b._id)
        })
    };

    return cardPackage_;
}
//用户头像
export const userTx = function (md5) {
    const md5Str = md5 || "";
    let txUrl = "";
    if (md5Str && md5Str.length > 6) {
        const userMD5Last6 = md5.substring(md5.length - 6, md5.length);
        const userMD5Fix = Number("0x" + userMD5Last6);
        txUrl = "/static/userTx/" + userMD5Fix % 31 + ".png";
    }
    return txUrl;
}
//数组去重
export const unique = function (arr) {
    if (!Array.isArray(arr)) {
        return arr;
    }
    if (arr.length < 2) {
        return arr;
    }
    return Array.from(new Set(arr))
}
export const mailCheck = function (email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}
// 检查数据库objectID
export const objectIDCheck = function (bjectID) {
    return /^[0-9a-f]{24}$/.test(bjectID)
}
//检查密码格式
export const passwordCheck = function (password) {
    return /^[\w_-]{4,16}$/.test(password)//4-16位英数字下划线减号
}
//检查昵称格式
export const nickNameCheck = function (nickName) {
    return /^[\u4E00-\u9FA5\u0800-\u4e00A-Za-z0-9_]{2,8}$/.test(nickName)//2-8位中文、日文、英文、数字包括下划线
}
//数字补充0
export const PrefixInteger = function (num, length) {
    if ((num + '').length > length) {
        return num + '';
    }
    return (Array(length).join('0') + num).slice(-length);
}
//检查MD5
export const md5Check = function (MD5) {
    return /^[A-Za-z0-9]{32}$/.test(MD5)//32位MD5
}
// 随机区间内整数
export const randomNum = function (n, m) {
    var random = Math.floor(Math.random() * (m - n + 1) + n);
    return random;
}
//读图
export const loadingImg = function (imgSrcArr, resolve_, reject_) {
    var imgLength = imgSrcArr.length;
    var proArr = [];
    let images = [];
    for (var i = 0; i < imgLength; i++) {
        proArr[i] = new Promise((resolve, reject) => {
            images[i] = new Image();
            images[i].src = imgSrcArr[i];
            images[i].onload = function () {
                resolve('ok');
            };
            images[i].onerror = function () {
                reject('err');
            }
        })
    }
    Promise.all(proArr).then((results) => {
        console.log(results);
        resolve_('img all ok');
    }).catch((reason) => {
        reject_(reason);
    });
}

//接口加载
let loadingCount = 0;
let loading;
let loadingTimer = null;

const startLoading = () => {
    loading = Loading.service({
        background: 'rgba(255,255,255,0)',
        text: '努力加载中...',
        spinner: 'el-icon-loading'
    });
};

const endLoading = () => {
    loading.close();
};

export const showLoading = () => {
    clearTimeout(loadingTimer);
    loadingTimer = setTimeout(() => {
        Message({
            message: '加载时间过长，可能是因为网络原因，请刷新页面！',
            type: 'warning',
            duration: 0,
            showClose: true
        })
    }, 30000);
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
        clearTimeout(loadingTimer);
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
// base64
export const base64_ = function () {
    // private property  
    let _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    // public method for encoding  
    this.encode = function (input) {
        var output = "";
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
        var i = 0;
        input = _utf8_encode(input);
        while (i < input.length) {
            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);
            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;
            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }
            output = output +
                _keyStr.charAt(enc1) + _keyStr.charAt(enc2) +
                _keyStr.charAt(enc3) + _keyStr.charAt(enc4);
        }
        return output;
    }

    // public method for decoding  
    this.decode = function (input) {
        var output = "";
        var chr1, chr2, chr3;
        var enc1, enc2, enc3, enc4;
        var i = 0;
        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
        while (i < input.length) {
            enc1 = _keyStr.indexOf(input.charAt(i++));
            enc2 = _keyStr.indexOf(input.charAt(i++));
            enc3 = _keyStr.indexOf(input.charAt(i++));
            enc4 = _keyStr.indexOf(input.charAt(i++));
            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;
            output = output + String.fromCharCode(chr1);
            if (enc3 != 64) {
                output = output + String.fromCharCode(chr2);
            }
            if (enc4 != 64) {
                output = output + String.fromCharCode(chr3);
            }
        }
        output = _utf8_decode(output);
        return output;
    }

    // private method for UTF-8 encoding  
    const _utf8_encode = function (string) {
        string = string.replace(/\r\n/g, "\n");
        var utftext = "";
        for (var n = 0; n < string.length; n++) {
            var c = string.charCodeAt(n);
            if (c < 128) {
                utftext += String.fromCharCode(c);
            } else if ((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            } else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }

        }
        return utftext;
    }

    // private method for UTF-8 decoding  
    const _utf8_decode = function (utftext) {
        var string = "";
        var i = 0;
        var c = 0;
        var c1 = 0;
        var c2 = 0;
        while (i < utftext.length) {
            c = utftext.charCodeAt(i);
            if (c < 128) {
                string += String.fromCharCode(c);
                i++;
            } else if ((c > 191) && (c < 224)) {
                c2 = utftext.charCodeAt(i + 1);
                string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                i += 2;
            } else {
                c2 = utftext.charCodeAt(i + 1);
                c3 = utftext.charCodeAt(i + 2);
                string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                i += 3;
            }
        }
        return string;
    }
}