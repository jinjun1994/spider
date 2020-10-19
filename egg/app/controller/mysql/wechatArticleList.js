
const { Controller } = require('egg');
/**
  * @controller
  */
class WechatArticleListsController extends Controller {
  async index() {
    const lists = await this.ctx.wechatModel.WechatArticleList.findAll();
    this.ctx.body = lists;
  }
}
module.exports = WechatArticleListsController;
