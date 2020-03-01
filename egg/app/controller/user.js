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

      ctx.body = await ctx.service.user.list({});
    } catch (err) {
      ctx.logger.warn(err);
      ctx.body = {
        eror: err.message
      };
    }
  }


}
module.exports = UsersController;
