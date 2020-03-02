'use strict';
const Controller = require('egg').Controller;
/**
  * @controller
  */
class WeiboController extends Controller {


  async index(ctx) {
    try {
      const { content, user_id } = ctx.query;
      let options;
      if (content) {
        options = {
          content: new RegExp(content, 'i')
        };
      } else {
        options = {
        };
      }
      if (user_id) options.user_id = user_id;

      ctx.body = await ctx.service.crud.index(ctx.service.weibo, options);
    } catch (err) {
      ctx.logger.warn(err);
      throw err;
    }
  }


}
module.exports = WeiboController;
