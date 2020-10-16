
 /* eslint-disable */
 'use strict';
 const merge = (target, source) => {
    const keys = Object.keys(target);
    keys.forEach(k => {
      if (source.hasOwnProperty(k)) {
        if (Object.prototype.toString.call(source[k]) === '[object Object]') {
          merge(target[k], source[k]);
        } else {
          target[k] = source[k];
        }
      }
    });
  };
const env = process.env.NODE_ENV || 'development';

const isDev = env === 'development';
const isProd = env === 'production';
const config = {

    // 环境相关
    env,
    isDev,
    isProd,
    cookies:[],
    // oss相关配置
    ossAuth:{
        "region": "region",
        "bucket": "bucket",
        "accessKeyId": "accessKeyId",
        "accessKeySecret": "accessKeySecret"
    },
    // path:"//jinjun1994.oss-cn-hangzhou.aliyuncs.com/auto_upload_ci/spider/", 废弃配置
    url:"https://jinjun1994.oss-cn-hangzhou.aliyuncs.com",
     // redis 设置
  redis: {
    port: 6379,
    host: '127.0.0.1',
    password: null, //无密码默认null 即可
    // 存储抓取文章列表的 key 名称
    POST_LIST_KEY: 'wechat_spider:post_list',
    // 存储抓取微信公众号历史列表的 key 名称
    PROFILE_LIST_KEY: 'wechat_spider:profile_list'
  },
  sequelize : {
    dialect: 'mysql',// 数据库类型 support: mysql, mariadb, postgres, mssql 
    host: '127.0.0.1', 
    port: 3306,   
    username: 'root',
    password: '',
    database: 'wechat', // 数据库名称
    delegate: 'wechatModel', // load all models to `app[delegate]` and `ctx[delegate]`, default to `model`
    baseDir: 'wechatModel', // load all files in `app/${baseDir}` as models, default to `model`
  },
}
// 加载自定义的配置
try {
    const myConfig = require('./my_config.js');
    merge(config, myConfig);
  } catch (e) {
    // Do nothing
  }
  
  module.exports = config;