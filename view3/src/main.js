import 'element-ui/lib/theme-chalk/base.css';
import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import './assets/styles/index.css';
import './assets/styles/card.css';
import SequentialEntrance from 'vue-sequential-entrance'
import 'vue-sequential-entrance/vue-sequential-entrance.css'
import VueClipboard from 'vue-clipboard2'

Vue.config.productionTip = false;
Vue.prototype.$wikimoecard = {
  "url":"/card/"
};
Vue.prototype.$wikimoecard.l2dMassage = function(){
  console.log('live2d还在加载...');
};
window.$l2dMotion = {};
Vue.prototype.$wikimoecard.l2dMassageClose = function(){
  console.log('live2d还在加载...');
};

Vue.use(VueClipboard)
Vue.use(SequentialEntrance);
Vue.use(ElementUI);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
