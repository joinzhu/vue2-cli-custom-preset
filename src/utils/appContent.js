/**
 * 全局魔法变量
 */
// oss域名
export const oss_url = '//uifox-public.oss-cn-hangzhou.aliyuncs.com'

export const VUE_APP_MODE = process.env.VUE_APP_MODE

// 环境变量相关配置
export const MODE_CONF = {
  development: {
    base_url: ''
  },
  dev: {
    base_url: '//gateway.dev.eline56-inc.com'
  },
  test: {
    base_url: '//gateway.test.eline56-inc.com'
  },
  prepub: {
    base_url: '//gateway.prepub.eline56-inc.com'
  },
  prod: {
    base_url: '//gateway-gray.eline56.com'
  }
}[VUE_APP_MODE]
