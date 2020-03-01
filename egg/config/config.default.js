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
