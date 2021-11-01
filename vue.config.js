'use strict'
const path = require('path')
const webpack = require('webpack')
const chalk = require('chalk')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const defaultSettings = require('./src/settings.js')
const localInfo = require('./localInfo.min')
let getwayUrl = `https://dev-erp.szhibu.com`
let authUrl = `https://dev-sso.szhibu.com`
let grayJsonPre = `/stage-api`
const envData = require('./config/envData.js')
const SpriteLoaderPlugin = require('svg-sprite-loader/plugin')
const iconsVersion = envData.iconsVersion
require('events').EventEmitter.defaultMaxListeners = 0

if (process.env.VUE_APP_ENV !== 'development') {
  getwayUrl = `https://${process.env.VUE_APP_ENV}-erp.szhibu.com`
  authUrl = `https://${process.env.VUE_APP_ENV}-sso.szhibu.com`
  grayJsonPre = `/${process.env.VUE_APP_ENV}-api`
}

const plugins = [
  new CopyWebpackPlugin([
    { from: path.resolve(__dirname, './src/static/'), to: path.resolve(__dirname, './dist/static/') }
  ]),
  new SpriteLoaderPlugin(),
  new webpack.ProgressPlugin(function handler(percentage, msg) {
    if (percentage === 1) {
      localInfo.getDomanIp().then(res => {
        console.log(chalk.yellow(`接口地址：${res.domain}\nIP：${res.IP}\n地址协议族是：IPV${res.IPV}`))
      })
    }
  }),
  new webpack.DefinePlugin({
    'process.env': {
      'envData': JSON.stringify(envData),
      'getLocal': JSON.stringify(localInfo.getLocal),
      'iconsVersion': iconsVersion
    }
  })
]

function resolve(dir) {
  return path.join(__dirname, dir)
}

const name = defaultSettings.title || '' // page title

// If your port is set to 80,
// use administrator privileges to execute the command line.
// For example, Mac: sudo npm run
// You can change the port by the following method:
// port = 9527 npm run dev OR npm run dev --port = 9527
const port = process.env.port || process.env.npm_config_port || 9527 // dev port

// All configuration item explanations can be find in https://cli.vuejs.org/config/
module.exports = {
  /**
   * You will need to set publicPath if you plan to deploy your site under a sub path,
   * for example GitHub Pages. If you plan to deploy your site to https://foo.github.io/bar/,
   * then publicPath should be set to "/bar/".
   * In most cases please use '/' !!!
   * Detail: https://cli.vuejs.org/config/#publicpath
   */
  publicPath: '/',
  outputDir: 'dist',
  assetsDir: 'static',
  lintOnSave: process.env.NODE_ENV === 'development',
  productionSourceMap: false,
  transpileDependencies: [
    'vue-echarts',
    'resize-detector'
  ],
  devServer: {
    port: port,
    open: false,
    overlay: {
      warnings: false,
      errors: true
    },
    hot: true,
    proxy: {
      // change xxx-api/login => mock/login
      // detail: https://cli.vuejs.org/config/#devserver-proxy
      // [process.env.VUE_APP_BASE_API]: {
      // ['^' + '/api']: {
      //   // target: `http://172.16.1.231:8901`,
      //   target: `http://172.16.1.232:8910/`,
      //   changeOrigin: true,
      //   pathRewrite: {
      //     ['^' + '/api']: ''
      //   }
      // },
      ['^' + process.env.VUE_APP_BASE_API + '/userCenter']: {
        target: getwayUrl,
        // bypass: function(req, res, proxyOptions) {
        //   console.log(req, res, proxyOptions)
        // },
        changeOrigin: true,
        pathRewrite: {
          ['^' + process.env.VUE_APP_BASE_API + '/userCenter' ]: '/api/textile/v1/userCenter'
        }
      },
      ['^' + process.env.VUE_APP_BASE_API + '/msg']: {
        target: getwayUrl,
        changeOrigin: true,
        pathRewrite: {
          ['^' + process.env.VUE_APP_BASE_API + '/msg' ]: '/api/message/v1/msg'
        }
      },
      ['^' + process.env.VUE_APP_BASE_API + '/srm']: {
        target: getwayUrl,
        changeOrigin: true,
        pathRewrite: {
          ['^' + process.env.VUE_APP_BASE_API + '/srm' ]: '/api/textile/v1/srm'
        }
      },
      ['^' + process.env.VUE_APP_BASE_API + '/finance']: {
        target: getwayUrl,
        changeOrigin: true,
        pathRewrite: {
          ['^' + process.env.VUE_APP_BASE_API + '/finance' ]: '/api/textile/v1/finance'
        }
      },
      ['^' + process.env.VUE_APP_BASE_API + '/product']: {
        target: getwayUrl,
        changeOrigin: true,
        pathRewrite: {
          ['^' + process.env.VUE_APP_BASE_API + '/product' ]: '/api/textile/v1/product'
        }
      },
      ['^' + process.env.VUE_APP_BASE_API + '/basis']: {
        target: getwayUrl,
        changeOrigin: true,
        pathRewrite: {
          ['^' + process.env.VUE_APP_BASE_API + '/basis' ]: '/api/textile/v1/basis'
        }
      },
      ['^' + process.env.VUE_APP_BASE_API + '/crm']: {
        target: getwayUrl,
        changeOrigin: true,
        pathRewrite: {
          ['^' + process.env.VUE_APP_BASE_API + '/crm' ]: '/api/crm/v1/crm'
        }
      },
      ['^' + process.env.VUE_APP_BASE_API + '/color']: {
        target: getwayUrl,
        changeOrigin: true,
        pathRewrite: {
          ['^' + process.env.VUE_APP_BASE_API + '/color' ]: '/api/textile/v1/color'
        }
      },
      ['^' + process.env.VUE_APP_BASE_API + '/aps']: {
        target: getwayUrl,
        changeOrigin: true,
        pathRewrite: {
          ['^' + process.env.VUE_APP_BASE_API + '/aps' ]: '/api/textile/v1/aps'
        }
      },
      ['^' + process.env.VUE_APP_BASE_API + '/customerOrder']: {
        target: getwayUrl,
        changeOrigin: true,
        pathRewrite: {
          ['^' + process.env.VUE_APP_BASE_API + '/customerOrder' ]: '/api/textile/v1/customerOrder'
        }
      },
      ['^' + process.env.VUE_APP_BASE_API + '/customerCenter']: {
        target: getwayUrl,
        changeOrigin: true,
        pathRewrite: {
          ['^' + process.env.VUE_APP_BASE_API + '/customerCenter' ]: '/api/textile/v1/customerCenter'
        }
      },
      ['^' + process.env.VUE_APP_BASE_API + '/techManage']: {
        target: getwayUrl,
        changeOrigin: true,
        pathRewrite: {
          ['^' + process.env.VUE_APP_BASE_API + '/techManage' ]: '/api/textile/v1/techManage'
        }
      },
      ['^' + process.env.VUE_APP_BASE_API + '/wms']: {
        target: getwayUrl,
        changeOrigin: true,
        pathRewrite: {
          ['^' + process.env.VUE_APP_BASE_API + '/wms' ]: '/api/textile/v1/wms'
        }
      },
      ['^' + process.env.VUE_APP_BASE_API + '/priceCenter']: {
        target: getwayUrl,
        changeOrigin: true,
        pathRewrite: {
          ['^' + process.env.VUE_APP_BASE_API + '/priceCenter' ]: '/api/textile/v1/priceCenter'
        }
      },
      ['^' + process.env.VUE_APP_BASE_API + '/qa']: {
        target: getwayUrl,
        changeOrigin: true,
        pathRewrite: {
          ['^' + process.env.VUE_APP_BASE_API + '/qa' ]: '/api/textile/v1/qa'
        }
      },
      ['^' + process.env.VUE_APP_BASE_API + '/bmpAps']: {
        target: getwayUrl,
        changeOrigin: true,
        pathRewrite: {
          ['^' + process.env.VUE_APP_BASE_API + '/bmpAps' ]: '/api/textile/v1/bmpAps'
        }
      },
      ['^' + process.env.VUE_APP_BASE_API + '/openapi']: {
        target: getwayUrl,
        changeOrigin: true,
        pathRewrite: {
          ['^' + process.env.VUE_APP_BASE_API + '/openapi' ]: '/api/textile/v1/openapi'
        }
      },
      ['^' + process.env.VUE_APP_BASE_API + '/pms']: {
        target: getwayUrl,
        changeOrigin: true,
        pathRewrite: {
          ['^' + process.env.VUE_APP_BASE_API + '/pms' ]: '/api/textile/v1/pms'
        }
      },
      ['^' + process.env.VUE_APP_BASE_API + '/common']: {
        target: getwayUrl,
        changeOrigin: true,
        pathRewrite: {
          ['^' + process.env.VUE_APP_BASE_API + '/common' ]: '/api/textile/v1/common'
        }
      },
      ['^' + process.env.VUE_APP_BASE_API + '/sysSettings']: {
        target: getwayUrl,
        changeOrigin: true,
        pathRewrite: {
          ['^' + process.env.VUE_APP_BASE_API + '/sysSettings' ]: '/api/textile/v1/sysSettings'
        }
      },
      ['^' + process.env.VUE_APP_BASE_API + '/soPrint']: {
        target: getwayUrl,
        changeOrigin: true,
        pathRewrite: {
          ['^' + process.env.VUE_APP_BASE_API + '/soPrint' ]: '/api/textile/v1/soPrint'
        }
      },
      ['^' + process.env.VUE_APP_BASE_API + '/processingMgr']: {
        target: getwayUrl,
        changeOrigin: true,
        pathRewrite: {
          ['^' + process.env.VUE_APP_BASE_API + '/processingMgr' ]: '/api/textile/v1/processingMgr'
        }
      },
      ['^' + process.env.VUE_APP_BASE_API + '/baseData']: {
        target: getwayUrl,
        changeOrigin: true,
        pathRewrite: {
          ['^' + process.env.VUE_APP_BASE_API + '/baseData' ]: '/api/textile/v1/baseData'
        }
      },
      ['^' + process.env.VUE_APP_BASE_API + '/oauth']: {
        target: authUrl,
        changeOrigin: true,
        pathRewrite: {
          ['^' + process.env.VUE_APP_BASE_API ]: ''
        }
      },
      ['^' + process.env.VUE_APP_BASE_API + '/java/gray']: {
        target: getwayUrl,
        changeOrigin: true,
        pathRewrite: {
          ['^' + process.env.VUE_APP_BASE_API ]: grayJsonPre
        }
      },
      ['^' + process.env.VUE_APP_BASE_API + '/ngx-kafka']: {
        target: getwayUrl,
        changeOrigin: true,
        pathRewrite: {
          ['^' + process.env.VUE_APP_BASE_API ]: grayJsonPre
        }
      },
      ['^' + process.env.VUE_APP_BASE_API + '/errormsg']: {
        target: getwayUrl,
        changeOrigin: true,
        pathRewrite: {
          ['^' + process.env.VUE_APP_BASE_API ]: grayJsonPre
        }
      },
      ['^' + process.env.VUE_APP_BASE_API + '/mock']: {
        target: `https://yapi.szhibu.com`,
        changeOrigin: true,
        pathRewrite: {
          ['^' + process.env.VUE_APP_BASE_API ]: ''
        }
      }
    },
    after: require('./mock/mock-server.js')
  },
  configureWebpack: config => {
    // provide the app's title in webpack's name field, so that
    // it can be accessed in index.html to inject the correct title.
    if (process.env.NODE_ENV === 'production') {
      // config.optimization.minimizer[0].options.terserOptions.compress.warnings = false
      // config.optimization.minimizer[0].options.terserOptions.compress.drop_console = true
      config.optimization.minimizer[0].options.terserOptions.compress.drop_debugger = true
      config.optimization.minimizer[0].options.terserOptions.compress.pure_funcs = ['console.log']
    }
    return {
      module: {
        rules: [
          {
            test: /\.gz$/,
            enforce: 'pre',
            use: 'gzip-loader'
          }
        ]
      },
      name,
      externals: {
        'vue': 'Vue',
        'element-ui': 'ELEMENT',
        'vue-router': 'VueRouter',
        'vuex': 'Vuex',
        'axios': 'axios',
        'html2canvas': 'html2canvas',
        'domtoimage': 'domtoimage',
        'vue-echarts': 'VueECharts',
        'echarts': 'echarts',
        'jspdf': 'jspdf',
        'sortablejs': 'Sortable',
        'jsbarcode': 'JsBarcode',
        'highlight.js': 'hljs',
        'pinyinUtil': 'pinyinUtil',
        'favico.js': 'Favico',
        'wss': 'ReconnectingWebSocket'
      },
      resolve: {
        alias: {
          '@': resolve('src')
        }
      },
      plugins
    }
  },
  chainWebpack(config) {
    config.plugins.delete('preload') // TODO: need test
    config.plugins.delete('prefetch') // TODO: need test

    const cdn = {
      css: ['https://sfabric-exhibition.oss-cn-shenzhen.aliyuncs.com/user-center/static/other/css/29f459a44fee58c7.css?v=2'],
      js: [
        'https://sfabric-exhibition.oss-cn-shenzhen.aliyuncs.com/user-center/static/other/js/043535d1b300177d.js?v=1',
        'https://sfabric-exhibition.oss-cn-shenzhen.aliyuncs.com/user-center/static/other/js/ffdf45175dc11155.js?v=3',
        'https://sfabric-exhibition.oss-cn-shenzhen.aliyuncs.com/user-center/static/other/js/c8af5e4e3e725dd7.js?v=1',
        'https://sfabric-exhibition.oss-cn-shenzhen.aliyuncs.com/user-center/static/other/js/477be49cda98ec16.js?v=4'
      ]
    }

    if (process.env.NODE_ENV === 'development') {
      cdn.css = ['/static/other/css/29f459a44fee58c7.css?v=2']
      cdn.js = [
        '/static/other/js/e45d38a2eb6930a5.js?v=1',
        '/static/other/js/ffdf45175dc11155.js?v=3',
        '/static/other/js/c8af5e4e3e725dd7.js?v=1',
        '/static/other/js/477be49cda98ec16.js?v=4'
      ]
    }
    config.plugin('html').tap(args => {
      args[0].cdn = cdn
      return args
    })

    // set svg-sprite-loader
    config.module
      .rule('svg')
      .exclude.add(resolve('src/icons'))
      .end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        extract: true,
        spriteFilename: `sprite_${iconsVersion}.svg`,
        symbolId: 'icon-[name]'
      })
      .end()

    // set preserveWhitespace
    config.module
      .rule('vue')
      .use('vue-loader')
      .loader('vue-loader')
      .tap(options => {
        options.compilerOptions.preserveWhitespace = true
        return options
      })
      .end()

    config
      .when(process.env.NODE_ENV !== 'development',
        config => {
          config
            .plugin('ScriptExtHtmlWebpackPlugin')
            .after('html')
            .use('script-ext-html-webpack-plugin', [{
              // `runtime` must same as runtimeChunk name. default is `runtime`
              inline: /runtime\..*\.js$/
            }])
            .end()
          config
            .optimization.splitChunks({
              chunks: 'all',
              cacheGroups: {
                // elementUI: {
                //   test: /[\\/]node_modules[\\/]_?element-ui(.*)/, // in order to adapt to cnpm
                //   name: 'chunk-elementUI', // split elementUI into a single package
                //   minChunks: 1,
                //   maxInitialRequests: 5,
                //   minSize: 0,
                //   priority: 10
                // },
                // echarts: {
                //   test: /[\\/]node_modules[\\/]echarts[\\/]/,
                //   name: 'chunk-echarts',
                //   minChunks: 1,
                //   maxInitialRequests: 5,
                //   minSize: 0,
                //   priority: 11
                // },
                // staticLibs: {
                //   // test: /[\\/]node_modules[\\/](element-ui|echarts|html2canvas|jspdf|sortablejs|vue|vue-router|vuex|axios|jsbarcode|highlight\.js|favico\.js|jsonwebtoken|crypto-js|zrender|canvg|elliptic|asn1\.js|core-js|public-encrypt|hash-base|bn\.js|create-ecdh|miller-rabin|browserify-rsa|browserify-sign)[\\/]/,
                //   test: /[\\/]node_modules[\\/](jsonwebtoken|crypto-js|zrender|canvg|elliptic|asn1\.js|core-js|public-encrypt|hash-base|bn\.js|create-ecdh|miller-rabin|browserify-rsa|browserify-sign)[\\/]/,
                //   name: 'chunk-staticLibs',
                //   minChunks: 1,
                //   maxInitialRequests: 5,
                //   minSize: 0,
                //   priority: 12
                // },
                libs: {
                  chunks: 'all',
                  test: /[\\/]node_modules[\\/]/,
                  name: 'chunk-libs',
                  minChunks: 1,
                  maxInitialRequests: 5,
                  minSize: 0,
                  priority: 2,
                  enforce: true
                },
                commons: {
                  chunks: 'all',
                  test: /[\\/]src[\\/]/,
                  name: 'chunk-commons',
                  minChunks: 2,
                  maxInitialRequests: 5,
                  minSize: 0,
                  priority: 1
                }
              }
            })
          // config.optimization.runtimeChunk('single')
        }
      )
  }
}
