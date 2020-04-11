'use strict';
const Controller = require('egg').Controller;
/**
  * @controller
  */
class WechatArticlesController extends Controller {

  async index(ctx) {

    const { account, biz } = ctx.query;
    const options = {
      ...(account ? { account } : {}),
      ...(biz ? { biz } : {}),
    };
    const articles = await ctx.service.mysql.wechatArticle.list(options);
    ctx.body = articles;
  }

  async show(ctx) {
    const article = await ctx.service.mysql.wechatArticle.find(ctx.params.id);
    ctx.body = article;
  }
}
module.exports = WechatArticlesController;