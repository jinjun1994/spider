const path = require('path');
const CompressionPlugin = require('compression-webpack-plugin');
const productionGzipExtensions = ['js', 'css']
const WebpackAliossPlugin = require('webpack-alioss-plugin');
const isProduction = process.env.NODE_ENV === 'production';
const cdn = {
  css: [
    // element-ui css
    'https://cdn.bootcss.com/element-ui/2.13.0/theme-chalk/index.css'
    // 'https://unpkg.com/element-ui/lib/theme-chalk/index.css'
  ],
  js: [
    // vue must at first!
    // 'https://unpkg.com/vue/dist/vue.js',
    "https://cdn.bootcss.com/vue/2.6.11/vue.min.js",
    "https://cdn.bootcss.com/vue-router/3.1.3/vue-router.min.js",
    "https://cdn.bootcss.com/axios/0.19.2/axios.min.js",
    // element-ui js
    // "https://unpkg.com/element-ui/lib/index.js"
    "https://cdn.bootcss.com/element-ui/2.13.0/index.js"

  ]
}

const externals = {
  vue: 'Vue',
  'element-ui': 'ELEMENT',
  'vue-router': 'VueRouter',
  'axios': 'axios',
};
module.exports = {
  // publicPath: 'spider',
  // publicPath: isProduction ? configs.path:'',
  // assetsDir: isProduction ? configs.path:'',

  outputDir: 'spider',
  productionSourceMap: false, // close sourceMap for production
  chainWebpack: config => {
    // config enternals
    config.externals({ ...config.get('externals'), ...externals });
    config.module.rule('eslint').use('eslint-loader').options({
      fix: true
    })

    config
    .plugin('html')
    .tap(args => {
      args[0].title = '集智阁'
      args[0].cdn = cdn
      return args
    })
    if (process.env.NODE_ENV === 'production') {
      
      // 生产环境 https://blog.csdn.net/qq_39953537/article/details/82188438
      config.plugin('CompressionPlugin').use(CompressionPlugin);

      // config.plugin('WebpackAliossPlugin').use(new WebpackAliossPlugin(
      //   {
      //     auth:configs.ossAuth,
      //     ossBaseDir: 'auto_upload_ci',
      //     project: 'spider', // 项目名(用于存放文件的直接目录)
      //   }
      // ));

      // https://medium.com/@aetherus.zhou/vue-cli-3-performance-optimization-55316dcd491c
  } else {
      // 开发环境
  }

  },

  // configureWebpack: {
  //   devtool: 'source-map',
  //   // plugins: [
  //   // ],
  //   resolve: {
  //     alias: {
  //       // share: path.resolve(__dirname, '../share/src')
  //     }
  //   }
  // },
  devServer: {
    // proxy: process.env.VUE_APP_PROXY || 'http://localhost:7001/',
       // disableHostCheck: true,
      port: 8888,
      open: true,
      proxy: {
        '/api': {
          target: 'http://localhost:7002/',
          pathRewrite: {
            '^/api': '/'
          }
        },
        '/weibos': {
          target: 'http://localhost:9990/',
          // pathRewrite: {
          //   '^/api': '/'
          // }
        },
      }
  },
};