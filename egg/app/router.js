'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);
  router.get('/time', controller.home.time);
  router.get('/user', controller.user.index);
  router.post('/user/submit', controller.user.submit);
  router.post('/user/bulkWrite', controller.user.bulkWrite);
  router.get('/user/:id', controller.user.findById);
  router.get('/weibo/analyze/:id', controller.weibo.analyze);
  router.get('/weibo', controller.weibo.index);
  router.get('/wechat/account', controller.wechatAccount.index);
  router.post('/wechat/submit', controller.wechatAccount.submit);


  // wechat mysql
  router.get('/mysql/wechat/account', controller.mysql.wechatAccount.index);

};
