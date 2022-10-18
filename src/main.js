import './public-path'
import Vue from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import actions from '@/actions'
import { proxyState } from '@wise/public-navigation'
import WiseUI from '@wise/element-ui'
import '@wise/element-ui/lib/ui.css'
import '@wise/element-ui/lib/global-and-cover.css'

Vue.use(ElementUI)
Vue.use(WiseUI)
Vue.use(proxyState)

Vue.config.productionTip = false

let localRouter = null
let instance = null
function render(props = {}) {
  const { container } = props
  localRouter = router
  instance = new Vue({
    router: localRouter,
    store,
    render: h => h(App)
  }).$mount(container ? container.querySelector('#app') : '#app')
}

// 独立运行时
if (!window.__POWERED_BY_QIANKUN__) {
  render()
}

// 接入qiankun主应用后会触发的钩子
export async function bootstrap() {
  console.log('qiankun-son-app 😊 bootstrap')
}

// 接入qiankun主应用后会触发的钩子
export async function mount(props) {
  console.log('qiankun-son-app 😊 mount', props)
  // 将qiankun主应用传递的行为子应用化
  actions.setActions(props)
  render(props)
}

// 接入qiankun主应用后会触发的钩子
export async function unmount() {
  console.log('qiankun-son-app 😊 unmount')
  instance.$destroy()
  instance.$el.innerHTML = ''
  instance = null
  localRouter = null
}
