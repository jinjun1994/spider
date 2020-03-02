/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {

    mongoose: {
      // url: process.env.SPIDER_MONGODB || 'mongodb://127.0.0.1/weibo',
      url: 'mongodb://localhost/weibo',
      options: {
        // reconnectInterval: 15000,
        // https://github.com/Automattic/mongoose/issues/6890
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
      // mongoose global plugins, expected a function or an array of function and options
    },
    onerror: {
      all(err, ctx) {
        // 在此处定义针对所有响应类型的错误处理方法
        // 注意，定义了 config.all 之后，其他错误处理方法不会再生效
        ctx.body = { message: err.message || 'error' };
        ctx.status = 500;
      },

    }
  };

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1573328080173_7422';

  // add your middleware config here
  config.middleware = [];

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };


  return {
    ...config,
    ...userConfig,
  };
};
