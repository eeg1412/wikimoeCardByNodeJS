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
    { name: 'home', path: '/', meta:{login:false}, component: HomeView },
    { name: 'reg', path: '/reg', meta:{login:false}, component: regView },
    { name: 'find', path: '/find', meta:{login:false}, component: findView },
    { name: 'demining', path: '/demining', meta:{login:false}, component: deminingView },
    { name: 'shop', path: '/star/shop', meta:{login:true}, component: shopView },
    { name: '404', path: '/404', meta:{login:false}, component: NotfoundView },
    { path: '*', redirect: '/404' },
  ],
})
router.beforeEach((to, from, next) => {
  console.log(to);
  showLoading();
  next();
});
router.afterEach((to, from) => {
  hideLoading();
});
export default router
