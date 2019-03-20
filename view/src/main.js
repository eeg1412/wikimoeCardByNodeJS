// fade/zoom 等
import 'element-ui/lib/theme-chalk/base.css';
import Vue from 'vue'

import vuexStore from '@/store'
import router from '@/router'
import httpPlugin from '@/service/httpPlugin'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from '@/App'
import './assets/styles/index.css';
import './assets/styles/card.css';
import SequentialEntrance from 'vue-sequential-entrance'
import 'vue-sequential-entrance/vue-sequential-entrance.css'
Vue.use(SequentialEntrance);
Vue.use(ElementUI);
Vue.use(httpPlugin)

const app = new Vue({
  ...App,
  router,
  store: vuexStore,
})

document.addEventListener('DOMContentLoaded', () => {
  app.$mount('#app')
})

// // service worker
// if (window.location.protocol === 'https:' && navigator.serviceWorker) {
//   navigator.serviceWorker.register('/service-worker.js')
// }
