'use strict';
const Controller = require('egg').Controller;
/**
  * @controller
  */
class WechatArticlesController extends Controller {
  async index() {
    const articles = await this.ctx.wechatModel.WechatArticle.findAll();
    this.ctx.body = articles;
  }

}
module.exports = WechatArticlesController;