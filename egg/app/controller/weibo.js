
const { Controller } = require('egg');
/**
  * @controller
  */
class WeiboController extends Controller {
  async index(ctx) {
    try {
      const { content, user_id, original, origtrueinal_pictures, retweet_pictures, video_url } = ctx.query;

      const options = {
        ...(content ? { content: new RegExp(content, 'i') } : {}),
        ...(user_id ? { user_id } : {}),
        ...(original ? { original: original === 'true' } : {}),
        ...(origtrueinal_pictures ? { origtrueinal_pictures: { $ne: null } } : {}),
        ...(retweet_pictures ? { retweet_pictures: { $ne: null } } : {}),
        ...(video_url ? { video_url: { $ne: null } } : {}),
      };

      ctx.body = {
        ...await ctx.service.crud.index(ctx.service.weibo, options),
      };
    } catch (err) {
      ctx.logger.warn(err);
      throw err;
    }
  }

  async analyze(ctx) {
    try {
      const user_id = ctx.params.id;

      const options = {
        ...(user_id ? { user_id } : {}),
      };

      ctx.body = {
        ...(user_id ? { analyze: await ctx.service.weibo.analyze({ user_id }) } : {}),

      };
    } catch (err) {
      ctx.logger.warn(err);
      throw err;
    }
  }
}
module.exports = WeiboController;
