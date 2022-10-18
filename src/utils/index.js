/**
 * 工具函数
 */
import router from '@/router'

// 页面跳转，并置顶
export const routerProxy = new Proxy(router.push, {
  apply(target, thisBinding, args) {
    setTimeout(() => {
      document.querySelector('.page').scrollTop = 0
    }, 0)
    return router.push(...args)
  }
})

/**
 * @description: try catch
 * @param {function} 需要执行逻辑的函数
 * @param {any} 执行函数的参数
 * @return: array: array[0]: 错误 array[1]: 结果
 */
export async function tryCatch() {
  const args = Array.from(arguments)
  const asyncFunc = args.shift()
  try {
    const res = await asyncFunc(...args)
    return [null, res]
  } catch (e) {
    return [e, null]
  }
}
