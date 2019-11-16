import Vue from 'vue'
import Vuex from 'vuex'

import * as auth from '@/utils/auth'

Vue.use(Vuex)
// 组件要共享token，所以用vuex
export default new Vuex.Store({
  state: {
    // 用户信息（token refresh_token）
    user: auth.getUser()
  },
  // 修改用户信息
  mutations: {
    // 存储用户信息
    setUser (state, user) {
      // 更新state的状态，如果刷新了页面重新获取本地的数据
    //   会丢失之前的存储的状态，所以同时修改本地的用户信息
      state.user = user
      // 更新本地存储
      auth.setUser(user)
    },
    // 清除用户信息
    delUser (state) {
      // 更新state的状态
      state.user = {}
      // 更新本地存储
      auth.delUser()
    }
  },
  actions: {

  }
})
