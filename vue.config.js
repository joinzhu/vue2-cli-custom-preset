const path = require('path')
const { name } = require('./package')
const isPro = process.env.NODE_ENV === 'production'

function resolve(dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  publicPath: '/',
  productionSourceMap: process.env.NODE_ENV !== 'production',
  filenameHashing: true,
  chainWebpack: config => {
    config.module
    .rule('fonts')
    .use('url-loader')
    .loader('url-loader')
    .options({})
    .end()
    if (process.env.VUE_APP_REPORT === 'REPORT') {
      config
        .plugin('webpack-bundle-analyzer')
        .use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin)
    }
  },
  css: {
    extract: true
  },
  configureWebpack: {
    output: {
      library: `${name}-[name]`,
      libraryTarget: 'umd', // 把微应用打包成 umd 库格式
      jsonpFunction: `webpackJsonp_${name}`
    },
    resolve: {
      alias: {
        '@': resolve('./src'),
        '@ac$': resolve('./src/utils/appContent.js')
      }
    },
    externals: {
      PublicNavigation: 'PublicNavigation'
    },
    performance: {
      hints: isPro ? 'warning' : false,
      maxAssetSize: 512000
    },
    optimization: {
      minimize: true,
      splitChunks: {
        chunks: 'all',
        minSize: 50000,
        maxSize: 1000000,
        cacheGroups: {
          vue: {
            name: 'chunk-vuejs',
            test: /[\\/]node_modules[\\/]_?vue(.*)/,
            priority: 20
          },
          elementUI: {
            name: 'chunk-elementUI',
            priority: 30,
            test: /[\\/]node_modules[\\/]_?element-ui(.*)/
          }
        }
      }
    }
  },

  devServer: {
    publicPath: '/',
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    port: 3300,
    hot: true,
    open: true,
    proxy: {
      '/services': {
        // target: 'https://gateway.eline56.com',
        // target: 'http://218.81.9.26:8888',
        // target: 'http://192.168.20.101:8868',
        // target: 'http://hj-for-test.natapp1.cc',
        // target: 'http://192.168.30.210:8868',
        // target: 'http://192.168.40.164:8868', // lins
        // target: 'http://192.168.40.217:19501/',
        // target: 'http://192.168.30.100:19403',
        // target: 'http://gateway.test.eline56.com',
        // target: 'http://gateway.test.eline56-inc.com/',
        target: 'http://gateway.dev.eline56-inc.com',
        // target: 'http://192.168.40.217:8868', // 郑聪
        // target: 'http://192.168.40.151:19408', // 红旭
        // target: 'http://192.168.40.114:8868', // 郭靖
        // target: 'http://192.168.40.235:8868', // 赵昊
        // target: 'http://192.168.40.151:19408', // 红旭
        // target: 'http://192.168.40.141:8877', // 仲超
        pathRewrite: { '^/': '' }
      }
    }
  }
}
