import md5_ from 'js-md5';
import { authApi } from "../../api";

const state = {
  dailygeted: true,
  postList: [],
  postTotle: 0,
  postPage: 1,
}
const actions = {

}
const mutations = {
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
  actions,
  mutations,
}
