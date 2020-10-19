
const { Controller } = require('egg');
/**
  * @controller
  */
class WechatArticleTasksController extends Controller {
  async index() {
    // const tasks = await this.ctx.wechatModel.WechatArticleTask.findAll();
    this.ctx.body = await this.ctx.service.mysql.wechatArticleTask.list();
  }

  async create() {
    this.ctx.body = await this.ctx.service.mysql.wechatArticleTask.list();
  }

  async creates(list) {
    this.ctx.body = await this.ctx.service.mysql.wechatArticleTask.creates(list);
  }
}
module.exports = WechatArticleTasksController;
