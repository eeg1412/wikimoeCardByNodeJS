import { createAPI } from './create-api'
import auth from './module/auth'
import { Message } from 'element-ui';
import { showLoading, hideLoading } from '../../utils/utils';
import router from '../router'
import store from '../store'

const api = createAPI({ baseURL: '/api' })
let apiLoading = null;

api.defaults.timeout = 30000;

//请求拦截器
api.interceptors.request.use(config => {
  showLoading();
  return config
}, (error) => {
  hideLoading();
  return Promise.reject(error)
});

//响应拦截器
api.interceptors.response.use(
  response => {
    hideLoading();
    if (response.data.code == 403) {
      Message({
        message: '用户信息已过期，请重新登录！',
        type: 'error'
      })
      sessionStorage.removeItem("token");
      localStorage.removeItem("token");
      store.dispatch('app/setToken', undefined)
      router.replace('/');
    } else if (response.data.code == 402) {
      Message({
        message: '管理员信息已过期，请重新登录！',
        type: 'error'
      })
      sessionStorage.removeItem("adminToken");
      localStorage.removeItem("adminToken");
      router.replace('/cardadmin');
    }
    return response;
  }, error => {
    hideLoading();
    Message({
      message: '服务器连接发送错误，请稍后再试！',
      type: 'error'
    })
    return Promise.reject(error);
  }
);

export const authApi = auth(api)
