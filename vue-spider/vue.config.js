const path = require('path');

module.exports = {
  // publicPath: '',
  // outputDir: 'build',
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
          target: 'http://localhost:7001/',
          pathRewrite: {
            '^/api': '/'
          }
        },
      }
  },
};