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
const shopView = () => import(/* webpackChunkName: "shopView" */ '@/views/shop-view.vue')
const marketView = () => import(/* webpackChunkName: "marketView" */ '@/views/market/index.vue')
const handbookView = () => import(/* webpackChunkName: "handbookView" */ '@/views/handbook.vue')
const battleView = () => import(/* webpackChunkName: "battleView" */ '@/views/battle.vue')
const battleCardView = () => import(/* webpackChunkName: "battleView" */ '@/views/battlecard.vue')
const decomposeView = () => import(/* webpackChunkName: "decomposeView" */ '@/views/decompose.vue')
const decomposeitemView = () => import(/* webpackChunkName: "decomposeitemView" */ '@/views/decomposeitem.vue')
const upgradecardView = () => import(/* webpackChunkName: "battleCryView" */ '@/views/upgradecard.vue')
const dailyGetItemView = () => import(/* webpackChunkName: "dailyGetItemView" */ '@/views/userDaliyGetItem.vue')
const cardlevelchangeView = () => import(/* webpackChunkName: "dailyGetItemView" */ '@/views/cardlevelchange.vue')
const creatcardView = () => import(/* webpackChunkName: "dailyGetItemView" */ '@/views/creatcard.vue')
const guessCardView = () => import(/* webpackChunkName: "guessCardView" */ '@/views/guessCard/index.vue')
const goenView = () => import(/* webpackChunkName: "goenView" */ '@/views/goen.vue')
const questView = () => import(/* webpackChunkName: "questView" */ '@/views/quest.vue')

const adminLoginView = () => import(/* webpackChunkName: "adminLoginView" */ '@/views/admin/login-view.vue')
const adminInstallView = () => import(/* webpackChunkName: "adminInstallView" */ '@/views/admin/install-view.vue')
const adminCenter = () => import(/* webpackChunkName: "adminInstallView" */ '@/views/admin/center/index.vue')

if (process.env.NODE_ENV === 'development') {
  Vue.use(VueRouter)
}

const router = new VueRouter({
  mode: 'history',
  scrollBehavior(to, from, savedPosition) {
    console.log(to.query.page);
    if(!to.query.page){
      console.log('需要滚动到顶部');
      if (!savedPosition) {
        savedPosition = { x: 0, y: 0 }
      }

      return savedPosition
    }
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
      name: 'goen',
      path: '/goen',
      meta:{
        login:false,
        admin:false,
      },
      component: goenView
    },
    {
      name: 'quest',
      path: '/quest',
      meta:{
        login:false,
        admin:false,
      },
      component: questView
    },
    {
      path: '/star/market',
      component: marketView,
      children: [
        { //默认
          path: '',
          redirect: 'buycard'
        },
        {//买卡
          name: 'buyCard',
          path: 'buycard',
          component: resolve => require(['../views/market/buy.vue'], resolve),
          meta:{
            login:true,
            admin:false,
          },
        },
        {//卖卡
          name: 'sellCard',
          path: 'sellcard',
          component: resolve => require(['../views/market/sell.vue'], resolve),
          meta:{
            login:true,
            admin:false,
          },
        },
        {//求卡
          name: 'wantCard',
          path: 'wantCard',
          component: resolve => require(['../views/market/want.vue'], resolve),
          meta:{
            login:true,
            admin:false,
          },
        },
        {//卡牌详情
          name: 'cardDetail',
          path: 'carddetail',
          component: resolve => require(['../views/market/carddetail.vue'], resolve),
          meta:{
            login:true,
            admin:false,
          },
        },
      ]
    },
    {
      path: '/star/guessCard',
      component: guessCardView,
      children: [
        { //默认
          path: '',
          redirect: 'guess'
        },
        {//猜卡
          name: 'guess',
          path: 'guess',
          component: resolve => require(['../views/guessCard/guessCard.vue'], resolve),
          meta:{
            login:true,
            admin:false,
          },
        },
        {//兑换
          name: 'getGuessCard',
          path: 'getGuessCard',
          component: resolve => require(['../views/guessCard/getGuessCard.vue'], resolve),
          meta:{
            login:true,
            admin:false,
          },
        },
        {//往期
          name: 'guessHistory',
          path: 'guessHistory',
          component: resolve => require(['../views/guessCard/guessHistory.vue'], resolve),
          meta:{
            login:true,
            admin:false,
          },
        },
      ]
    },
    {
      name: 'handbook',
      path: '/handbook',
      meta:{
        login:true,
        admin:false,
      },
      component: handbookView
    },
    {
      name: 'battle',
      path: '/battle',
      meta:{
        login:true,
        admin:false,
      },
      component: battleView
    },
    {
      name: 'battlecard',
      path: '/battlecard',
      meta:{
        login:true,
        admin:false,
      },
      component: battleCardView
    },
    {
      name: 'upgradecard',
      path: '/upgradecard',
      meta:{
        login:true,
        admin:false,
      },
      component: upgradecardView
    },
    {
      name: 'decompose',
      path: '/decompose',
      meta:{
        login:true,
        admin:false,
      },
      component: decomposeView
    },
    {
      name: 'decomposeitem',
      path: '/decomposeitem',
      meta:{
        login:true,
        admin:false,
      },
      component: decomposeitemView
    },
    {
      name: 'dailygetitem',
      path: '/dailygetitem',
      meta:{
        login:true,
        admin:false,
      },
      component: dailyGetItemView
    },
    {
      name: 'cardlevelchange',
      path: '/cardlevelchange',
      meta:{
        login:true,
        admin:false,
      },
      component: cardlevelchangeView
    },
    {
      name: 'creatcard',
      path: '/creatcard',
      meta:{
        login:true,
        admin:false,
      },
      component: creatcardView
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
        {//给星星
          name: 'adminGiveStar',
          path: 'givestar',
          component: resolve => require(['../views/admin/center/givestar.vue'], resolve),
          meta:{
            login:true,
            admin:true,
          },
        },
        {//用户列表
          name: 'userList',
          path: 'userlist',
          component: resolve => require(['../views/admin/center/userlist.vue'], resolve),
          meta:{
            login:true,
            admin:true,
          },
        },
        {//修改密码
          name: 'passwordchange',
          path: 'passwordchange',
          component: resolve => require(['../views/admin/center/passwordchange.vue'], resolve),
          meta:{
            login:true,
            admin:true,
          },
        },
        {//设置secretkey
          name: 'secretkey',
          path: 'secretkey',
          component: resolve => require(['../views/admin/center/secretKey.vue'], resolve),
          meta:{
            login:true,
            admin:true,
          },
        },
        {//管理员日志
          name: 'adminlogs',
          path: 'adminlogs',
          component: resolve => require(['../views/admin/center/log.vue'], resolve),
          meta:{
            login:true,
            admin:true,
          },
        },
        {//新闻列表
          name: 'newslist',
          path: 'newslist',
          component: resolve => require(['../views/admin/center/newsList.vue'], resolve),
          meta:{
            login:true,
            admin:true,
          },
        },
        {//编辑更新新闻
          name: 'newseditor',
          path: 'newseditor',
          component: resolve => require(['../views/admin/center/newseditor.vue'], resolve),
          meta:{
            login:true,
            admin:true,
          },
        },
        {//卡包管理
          name: 'adminpackage',
          path: 'adminpackage',
          component: resolve => require(['../views/admin/center/package.vue'], resolve),
          meta:{
            login:true,
            admin:true,
          },
        },
        {//卡牌管理
          name: 'cardmanagement',
          path: 'cardmanagement',
          component: resolve => require(['../views/admin/center/cardManagement.vue'], resolve),
          meta:{
            login:true,
            admin:true,
          },
        },
        {//卡牌审核
          name: 'cardpass',
          path: 'cardpass',
          component: resolve => require(['../views/admin/center/cardPss.vue'], resolve),
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
    { path: '*', redirect: '/' },
  ],
})
router.beforeEach((to, from, next) => {
  console.log(to);
  if(to.meta.login&&!to.meta.admin){
    let token = sessionStorage.getItem("token")?sessionStorage.getItem("token"):localStorage.getItem("token");
    if(token){
      showLoading();
      next();
    }else{
      router.replace('/');
      return false;
    }
  }else if(to.meta.login&&to.meta.admin){
    let token = sessionStorage.getItem("adminToken")?sessionStorage.getItem("adminToken"):localStorage.getItem("adminToken");
    if(token){
      showLoading();
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
