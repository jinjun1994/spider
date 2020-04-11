'use strict';
const Controller = require('egg').Controller;
/**
  * @controller
  */
class WechatAccountsController extends Controller {
  async index(ctx) {

    const { account } = ctx.query;
    const options = {
      ...(account ? { account } : {}),
      page: ctx.helper.mysqlPageQuery(ctx.query)
    };
    const accounts = await ctx.service.mysql.wechatAccount.list(options);
    ctx.body = accounts;
  }

  async show(ctx) {
    const account = await ctx.service.mysql.wechatAccount.find(ctx.params.id);
    ctx.body = account;
  }
}
module.exports = WechatAccountsController;