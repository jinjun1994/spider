const path = require('path');
const CompressionPlugin = require('compression-webpack-plugin');
const productionGzipExtensions = ['js', 'css']

module.exports = {
  // publicPath: 'spider',
  outputDir: 'spider',
  productionSourceMap: false, // close sourceMap for production
  chainWebpack: config => {
    config.module.rule('eslint').use('eslint-loader').options({
      fix: true
    })
    config
    .plugin('html')
    .tap(args => {
      args[0].title = '集智阁'
      return args
    })
    if (process.env.NODE_ENV === 'production') {
      // 生产环境 https://blog.csdn.net/qq_39953537/article/details/82188438
      config.plugin('CompressionPlugin').use(CompressionPlugin);
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