
const { Controller } = require('egg');
const { Op } = require('sequelize');
/**
  * @controller
  */
class WechatArticlesController extends Controller {
  async index(ctx) {
    const { account, biz, content } = ctx.query;
    const options = {
      ...(account ? { account } : {}),
      ...(biz ? { biz } : {}),
      ...(content ? { content_html: {
        [Op.like]: `%${content}%`,
      } } : {}),
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
