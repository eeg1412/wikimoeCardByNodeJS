// import md5_ from 'js-md5';
// import { authApi } from "../../api";

const state = {
  dailygeted: true,
  postList: [],
  postTotle: 0,
  postPage: 1,
  serverDelay: 0,
  // 0确认失败，1确认成功，2确认中
  serverTimeCheckStatus: 2,
  token: sessionStorage.getItem("token") ? sessionStorage.getItem("token") : localStorage.getItem("token"),
  gameOnlineUser: 0,
  showOnlieUserDialog: false,
}
const getters = {
  serverDelay: state => state.serverDelay,
  serverTimeCheckStatus: state => state.serverTimeCheckStatus,
  token: state => state.token,
  gameOnlineUser: state => state.gameOnlineUser,
  showOnlieUserDialog: state => state.showOnlieUserDialog,
}
const actions = {
  setShowOnlieUserDialog ({ commit }, data) {
    commit('setShowOnlieUserDialog', data)
  },
  setGameOnlineUser ({ commit }, data) {
    commit('setGameOnlineUser', data)
  },
  setToken ({ commit }, data) {
    commit('setToken', data)
  },
  setServerDelay ({ commit }, data) {
    commit('setServerDelay', data)
  },
  setServerTimeCheckStatus ({ commit }, data) {
    commit('setServerTimeCheckStatus', data)
  }
}
const mutations = {
  setShowOnlieUserDialog (state, data) {
    state.showOnlieUserDialog = data;
  },
  setGameOnlineUser (state, data) {
    state.gameOnlineUser = data;
  },
  setToken (state, data) {
    state.token = data;
  },
  setServerDelay (state, data) {
    state.serverDelay = data;
  },
  setServerTimeCheckStatus (state, data) {
    state.serverTimeCheckStatus = data;
  },
  setDailygeted (state, data) {
    state.dailygeted = data;
  },
  setPostList (state, data) {
    state.postList = data;
  },
  setPostTotle (state, data) {
    state.postTotle = data;
  },
  setPostPage (state, data) {
    state.postPage = data;
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}
