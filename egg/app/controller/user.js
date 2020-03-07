// exports.index = function* (ctx) {
//   ctx.body = yield ctx.model.User.find({});
// };
/**
 * Created by junesh on 2017/11/20.
 */
'use strict';
const Controller = require('egg').Controller;
/**
  * @controller
  */
class UsersController extends Controller {


  async index(ctx) {
    try {
      const { nickname } = ctx.query;
      let options;
      if (nickname) {
        options = {
          nickname: new RegExp(nickname, 'i')
        };
      } else {
        options = {
        };
      }

      ctx.body = await ctx.service.crud.index(ctx.service.user, options);
    } catch (err) {
      ctx.logger.warn(err);
      throw err;
    }
  }
  async findById(ctx) {
    try {
      const { id } = ctx.params;
      ctx.body = await ctx.service.user.findById(id);
    } catch (err) {
      ctx.logger.warn(err);
      throw err;
    }
  }
  async bulkWrite(ctx) {
    try {
      const { bulkWrite } = ctx.request.body;
      ctx.body = await ctx.service.user.bulkWrite(bulkWrite);
    } catch (err) {
      ctx.logger.warn(err);
      throw err;
    }
  }

}
module.exports = UsersController;
