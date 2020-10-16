'use strict';
const Controller = require('egg').Controller;
const { Op } = require('sequelize');
/**
  * @controller
  */
class WechatAccountsController extends Controller {
  async index(ctx) {

    const { account } = ctx.query;
    const options = {
      ...(account ? { account: {
        [Op.like]: `%${account}%`
      } } : {}),

    };
    console.log(options);
    const accounts = await ctx.service.mysql.wechatAccount.list(options);
    console.log(accounts);

    for (const [ k, v ] of Object.entries(accounts.rows)) {
      accounts.rows[k].dataValues.accountTask = (await ctx.service.mysql.wechatAccountTask.list({ biz: v.biz })).rows[0];

    }
    ctx.body = accounts;
  }

  async show(ctx) {
    const account = await ctx.service.mysql.wechatAccount.find(ctx.params.id);
    ctx.body = account;
  }
}
module.exports = WechatAccountsController;