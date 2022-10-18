/**
 * qiankun主应用和子应用通信的桥梁
 */

const emptyActions = () => {
  console.warn('⚠️：当前action为空')
}
// 文档：https://qiankun.umijs.org/zh/api
class Actions {
  actions = {
    onGlobalStateChange: emptyActions,
    setGlobalState: emptyActions
  }
  setActions(globalActions) {
    this.actions = globalActions
  }
  // 监听全局状态
  onGlobalStateChange(...args) {
    return this.actions.onGlobalStateChange(...args)
  }
  // 设置主子应用全局state，参数与官网相同
  setGlobalState(...args) {
    return this.actions.setGlobalState(...args)
  }
}
let actions = new Actions()

export default actions
