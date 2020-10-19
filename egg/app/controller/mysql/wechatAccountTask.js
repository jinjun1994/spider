
const { Controller } = require('egg');
/**
  * @controller
  */
class WechatAccountTasksController extends Controller {
  async index() {
    const tasks = await this.ctx.wechatModel.WechatAccountTask.findAll();
    this.ctx.body = tasks;
  }
}
module.exports = WechatAccountTasksController;
