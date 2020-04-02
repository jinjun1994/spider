const ABU = require('alioss-batch-upload');
const configs = require('../../../config');
module.exports = {
  schedule: {
    interval: '12h', // 1 分钟间隔
    type: 'worker', // 指定所有的 worker 都需要执行
    immediate: true
  },
  async task(ctx) {
    const abu = new ABU({
      ...configs.ossAuth,
      ossDir: '/weibos/', // 阿里云OSS根目录，默认为'/',
      pattern: ''
    });
    abu.upload('../node-weiboSpider/weiboSpider/weibo/', {
      // options
    });// 上传当前目录
  },
};