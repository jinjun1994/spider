
const { Controller } = require('egg');
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
