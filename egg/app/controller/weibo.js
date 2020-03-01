'use strict';
const Controller = require('egg').Controller;
/**
  * @controller
  */
class WeiboController extends Controller {


  async index(ctx) {
    try {

      ctx.body = await ctx.service.weibo.list({});
    } catch (err) {
      ctx.logger.warn(err);
      ctx.body = {
        eror: err.message
      };
    }
  }


}
module.exports = WeiboController;
