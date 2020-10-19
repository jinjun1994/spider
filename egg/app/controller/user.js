// exports.index = function* (ctx) {
//   ctx.body = yield ctx.model.User.find({});
// };
/**
 * Created by junesh on 2017/11/20.
 */


const { Controller } = require('egg');
/**
  * @controller
  */
class UsersController extends Controller {
  async index(ctx) {
    try {
      const { nickname, where, regexp } = ctx.query;

      const options = {
        ...(nickname ? { nickname: new RegExp(nickname, 'i') } : {}),
        // ...((where && regexp) ? { [where]: new RegExp(`[${regexp}]$`) } : {}),
        ...((where && regexp) ? { [where]: new RegExp(regexp) } : {}),

      };
      // if (nickname) {
      //   options = {
      //     nickname: new RegExp(nickname, 'i')
      //   };
      // } else {
      //   options = {
      //   };
      // }

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

  async submit(ctx) {
    try {
      const { url } = ctx.request.body;
      const { user_id: id, nickname } = await ctx.service.user.findUserIdByUrl(url);
      if (!id) {
        throw new Error('未找到该微博用户');
      } else {
        const user = await ctx.service.user.findById(id);

        if (user) {
          ctx.body = {
            message: `${nickname || ''} 已经收录，无须提交`,
            user,
          };
        } else {
          const user = await ctx.service.user.create({
            id,
            nickname,
            status: 0,
            time: new Date('2010-1-1'),
          });
          if (user.errcode === 0) {
            user.message = `${nickname }收录成功`;
            ctx.body = user;
          } else {
            user.message = '提交失败';
            ctx.body = user;
          }
        }
      }
    } catch (err) {
      ctx.logger.warn(err);
      throw err;
    }
  }
}
module.exports = UsersController;
