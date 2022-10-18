<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import actions from '@/actions'

export default {
  async mounted() {
    if (window.__POWERED_BY_QIANKUN__) {
      // 接入qiankun运行
      // state: 变更后的状态; prev 变更前的状态
      actions.onGlobalStateChange(({ isLogin, userInfo }) => {
        this.setIsLogin(isLogin)
        this.setUserInfo(userInfo)
      }, true)
    } else {
      // 独立运行
      let { isLogin, userInfo } = await this.$proxyState()
      this.setIsLogin(isLogin)
      this.setUserInfo(userInfo)
    }
  },
  methods: {
    ...mapMutations('user', ['setIsLogin', 'setUserInfo'])
  }
}
</script>

<style lang="less"></style>
