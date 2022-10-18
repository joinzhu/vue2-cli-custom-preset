import Vue from 'vue'
import VueRouter from 'vue-router'
import { routes } from '@/router/items'

/**
 * 解决路由重复
 * */
//获取原型对象上的push函数
const originalPush = VueRouter.prototype.push
//修改原型对象中的push方法
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  // /app/需要改成与 主应用配置的 activeRule 一样
  base: window.__POWERED_BY_QIANKUN__ ? '/app/' : process.env.BASE_URL,
  routes
})

// 前置守卫
router.beforeEach(async (to, from, next) => {
  // 设置页面title
  document.title = to.meta.title + '-' + 'e航无忧'
  next()
})

export default router
