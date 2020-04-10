'use strict';
const Controller = require('egg').Controller;
/**
  * @controller
  */
class WechatArticleTasksController extends Controller {
  async index() {
    const tasks = await this.ctx.wechatModel.WechatArticleTask.findAll();
    this.ctx.body = tasks;
  }

}
module.exports = WechatArticleTasksController;