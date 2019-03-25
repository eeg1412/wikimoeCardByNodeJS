import { createAPI } from './create-api'
import auth from './module/auth'
import { Loading,Message } from 'element-ui';

const api = createAPI({ baseURL: '/api' })
let apiLoading = null;

api.defaults.timeout =  12000;

//请求拦截器
api.interceptors.request.use(config => {
    apiLoading = Loading.service();
    return config
}, (error) => {
    apiLoading.close();
    return Promise.reject(error)
});

//响应拦截器
api.interceptors.response.use(
  response => {
    apiLoading.close();
    return response;
  }, error => {
    apiLoading.close();
    Message({
        message:'服务器连接发送错误，请稍后再试！',
        type:'error'
    })
    return Promise.reject(error);
  }
);

export const authApi = auth(api)
