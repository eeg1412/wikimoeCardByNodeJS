import { createStore } from "vuex";
import { authApi } from "../api";

export default createStore({
  state: {
    token: "",
    playerInfo: null,
  },
  getters: {
    token: state => state.token,
    playerInfo: state => state.playerInfo,
  },
  mutations: {
    setToken (state, data) {
      state.token = data;
      // 每次重置完数据后尝试刷新玩家信息
      // if (data) {
      //   this.commit("setPlayerInfo");
      // }
    },
    setPlayerInfo (state) {
      authApi.getPlayerInfo().then(res => {
        if (res.data.code === 1) {
          state.playerInfo = res.data.playerInfo;
        }
      });
    },
  },
  actions: {},
  modules: {}
});
