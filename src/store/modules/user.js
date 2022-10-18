import cloneDeep from 'lodash/cloneDeep'

const state = {
  isLogin: false,
  userInfo: {}
}

const mutations = {
  setIsLogin(state, payload) {
    state.isLogin = payload
  },
  setUserInfo(state, payload) {
    state.userInfo = cloneDeep(payload)
  }
}

export default {
  namespaced: true,
  state,
  mutations
}
