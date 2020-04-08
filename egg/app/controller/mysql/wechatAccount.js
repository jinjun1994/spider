'use strict';
const Controller = require('egg').Controller;
/**
  * @controller
  */
class WechatAccountsController extends Controller {
  async index() {
    const accounts = await this.ctx.wechatModel.WechatAccount.findAll();
    this.ctx.body = accounts;
  }

//   async show() {
//     const user = await this.ctx.model.User.findByLogin(this.ctx.params.login);
//     await user.logSignin();
//     this.ctx.body = user;
//   }
}
module.exports = WechatAccountsController;