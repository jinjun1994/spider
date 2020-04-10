'use strict';
const Controller = require('egg').Controller;
/**
  * @controller
  */
class WechatArticleCommentsController extends Controller {
  async index() {
    const comments = await this.ctx.wechatModel.WechatArticleComment.findAll();
    this.ctx.body = comments;
  }

}
module.exports = WechatArticleCommentsController;