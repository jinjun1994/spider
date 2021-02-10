

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

  router.post('/wechat/article-list', controller.wechatAccount.getArticleListByTitle);


  // wechat mysql
  router.get('/mysql/wechat/account', controller.mysql.wechatAccount.index);
  router.get('/mysql/wechat/account/:id', controller.mysql.wechatAccount.show);
  router.get('/mysql/wechat/account/task', controller.mysql.wechatAccountTask.index);
  router.get('/mysql/wechat/article', controller.mysql.wechatArticle.index);
  router.get('/mysql/wechat/article/:id', controller.mysql.wechatArticle.show);
  router.get('/mysql/wechat/comment', controller.mysql.wechatArticleComment.index);
  router.get('/mysql/wechat/dynamic', controller.mysql.wechatArticleDynamic.index);
  router.get('/mysql/wechat/article/list', controller.mysql.wechatArticleList.index);
  router.get('/mysql/wechat/article/task', controller.mysql.wechatArticleTask.index);
};
