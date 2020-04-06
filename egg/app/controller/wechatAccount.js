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
class WechatAccountsController extends Controller {


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

      ctx.body = await ctx.service.crud.index(ctx.service.wechatAccount, options);
    } catch (err) {
      ctx.logger.warn(err);
      throw err;
    }
  }
  async findById(ctx) {
    try {
      const { id } = ctx.params;
      ctx.body = await ctx.service.wechatAccount.findById(id);
    } catch (err) {
      ctx.logger.warn(err);
      throw err;
    }
  }
  async bulkWrite(ctx) {
    try {
      const { bulkWrite } = ctx.request.body;
      ctx.body = await ctx.service.wechatAccount.bulkWrite(bulkWrite);
    } catch (err) {
      ctx.logger.warn(err);
      throw err;
    }
  }
  async submit(ctx) {
    try {
      const { title } = ctx.request.body;
      console.log(title);
      const account = await ctx.service.wechatAccount.findByTitle(title);

      if (account) {
        ctx.body = {
          message: `${title} 已经收录，无须提交`,
          account
        };
      } else {
        const { books } = await ctx.service.wechatAccount.findBookByTitle(title);
        books.filter(v => v.bookInfo && v.bookInfo.title === title && v.bookInfo.author === '公众号');
        console.log(books[0]);
        if (books.length > 0) {
          const { bookInfo: { bookId, title, cover, intro } } = books[0];
          const account = await ctx.service.wechatAccount.create({
            bookId,
            title,
            cover,
            intro
          });
          if (account) {
            account.message = title + '收录成功';
            ctx.body = account;
          } else {
            ctx.body = {
              message: '提交失败',
              account
            };
          }
        } else {
          ctx.body = {
            message: `${title} 未找到，请确认输入正确`,
            account
          };
        }

      }


    } catch (err) {
      ctx.logger.warn(err);
      throw err;
    }
  }

}
module.exports = WechatAccountsController;
