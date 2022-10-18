<template>
  <div class="home">
    <el-button @click="handleClick">获取用户信息</el-button>
    <div>
      <p>userId: {{userInfo.userId}}</p>
      <p>companyName: {{userInfo.companyName}}</p>
    </div>
  </div>
</template>

<script>

export default {
  name: "Home",
  data () {
    return {
      userInfo: {}
    }
  },
  methods: {
    handleClick () {
      this.userInfo = this.$store.state.user.userInfo
    }
  }
};
</script>
