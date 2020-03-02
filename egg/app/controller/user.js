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


}
module.exports = UsersController;
