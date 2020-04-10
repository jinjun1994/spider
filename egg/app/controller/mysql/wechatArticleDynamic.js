'use strict';
const Controller = require('egg').Controller;
/**
  * @controller
  */
class WechatArticleDynamicsController extends Controller {
  async index() {
    const dynamics = await this.ctx.wechatModel.WechatArticleDynamic.findAll();
    this.ctx.body = dynamics;
  }

}
module.exports = WechatArticleDynamicsController;