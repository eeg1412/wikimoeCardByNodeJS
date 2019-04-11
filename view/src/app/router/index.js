import Vue from 'vue'
import VueRouter from 'vue-router'
import { showLoading, hideLoading } from '../../utils/utils';

// first screen in app.js
import HomeView from '@/views/home-view.vue'
// lazy load
const NotfoundView = () => import(/* webpackChunkName: "rest" */ '@/views/notfound-view.vue')
const regView = () => import(/* webpackChunkName: "regView" */ '@/views/reg-view.vue')
const findView = () => import(/* webpackChunkName: "findView" */ '@/views/find-view.vue')
const deminingView = () => import(/* webpackChunkName: "deminingView" */ '@/views/demining-view.vue')
const shopView = () => import(/* webpackChunkName: "deminingView" */ '@/views/shop-view.vue')

const adminLoginView = () => import(/* webpackChunkName: "adminLoginView" */ '@/views/admin/login-view.vue')
const adminInstallView = () => import(/* webpackChunkName: "adminInstallView" */ '@/views/admin/install-view.vue')
const adminCenter = () => import(/* webpackChunkName: "adminInstallView" */ '@/views/admin/center/index.vue')

if (process.env.NODE_ENV === 'development') {
  Vue.use(VueRouter)
}

const router = new VueRouter({
  mode: 'history',
  scrollBehavior(to, from, savedPosition) {
    if (!savedPosition) {
      savedPosition = { x: 0, y: 0 }
    }

    return savedPosition
  },
  routes: [
    {
      name: 'home',
      path: '/',
      meta:{
        login:false,
        admin:false,
      },
      component: HomeView
    },
    {
      name: 'reg',
      path: '/reg',
      meta:{
        login:false,
        admin:false,
      },
      component: regView
    },
    {
      name: 'find',
      path: '/find',
      meta:{
        login:false,
        admin:false,
      },
      component: findView
    },
    {
      name: 'demining',
      path: '/demining',
      meta:{
        login:false,
        admin:false,
      },
      component: deminingView
    },
    {
      name: 'shop',
      path: '/star/shop',
      meta:{
        login:true,
        admin:false,
      },
      component: shopView
    },
    {
      name: 'adminLogin',
      path: '/cardadmin',
      meta:{
        login:false,
        admin:true,
      },
      component: adminLoginView
    },
    {
      name: 'adminInstallView',
      path: '/cardinstall',
      meta:{
        login:false,
        admin:true,
      },
      component: adminInstallView
    },
    {
      path: '/cardadmin/center',
      component: adminCenter,
      children: [
        { //默认
          path: '',
          redirect: 'setting'
        },
        {//设置
          name: 'adminSetting',
          path: 'setting',
          component: resolve => require(['../views/admin/center/setting.vue'], resolve),
          meta:{
            login:true,
            admin:true,
          },
        },
      ]
    },
    {
      name: '404',
      path: '/404',
      meta:{
        login:false,
        admin:false,
      },
      component: NotfoundView
    },
    { path: '*', redirect: '/404' },
  ],
})
router.beforeEach((to, from, next) => {
  console.log(to);
  if(to.meta.login&&!to.meta.admin){
    let token = sessionStorage.getItem("token")?sessionStorage.getItem("token"):localStorage.getItem("token");
    if(token){
      next();
    }else{
      router.replace('/');
      return false;
    }
  }else if(to.meta.login&&to.meta.admin){
    let token = sessionStorage.getItem("adminToken")?sessionStorage.getItem("adminToken"):localStorage.getItem("adminToken");
    if(token){
      next();
    }else{
      router.replace('/cardadmin');
      return false;
    }
  }else{
    showLoading();
    next();
  }
});
router.afterEach((to, from) => {
  hideLoading();
});
export default router
