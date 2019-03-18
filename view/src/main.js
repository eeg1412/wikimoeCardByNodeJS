import Vue from 'vue'

import vuexStore from '@/store'
import router from '@/router'
import httpPlugin from '@/service/httpPlugin'
import App from '@/App'

import 'src/assets/icons/iconfont.js'
import 'src/assets/styles/reset.styl'
import 'src/assets/styles/functional.styl'

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
