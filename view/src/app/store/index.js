import Vue from 'vue'
import Vuex from 'vuex'
import app from './module/app'

if (process.env.NODE_ENV === 'development') {
  Vue.use(Vuex)
}

const store = new Vuex.Store({
  modules: {
    app,
  },
})

export default store
