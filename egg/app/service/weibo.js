

const { Service } = require('egg');
const allSettled = require('promise.allsettled');

class WeiboService extends Service {
  // ////////////////////////数据库或其他外部环境相关调用的封装///////////////////////////

  // 1. mongoose

  /**
   * 查询符合条件的微博
   * @param {Object} options 条件
   * @param {Object} query 参数
   * @return {Array} 微博
   */
  async list(options, query) {
    try {
      const { skip, limit, sort } = query;
      const params = { sort: sort || { publish_time: -1 } };

      if (skip !== undefined && limit !== undefined) {
        params.skip = skip;
        params.limit = limit;
      }
      // https://cn.mongoosedoc.top/docs/populate.html#populate-virtuals
      return await this.app.model.Weibo.find(options, null, params)
        .populate({ path: 'author', select: 'nickname -_id -id weibo' });
    } catch (error) {
      throw error;
    }
  }

  /**
   * 微博分析
   * @param {Object} options 条件
   * @return {Object} 分析结果
   */
  async analyze({ user_id } = {}) {
    // user_id = this.service.crud.objectId(user_id);
    const types = ['year', 'month', 'hour', 'dayOfWeek', 'dayOfMonth'];
    return (await this.analyzeByTime({ user_id, types }))[0];
  }

  async analyzeByTime({ user_id, types } = {}) {
    const $facet = {

    };

    for (const type of types) {
      $facet[type] = [{ $group: {
        _id: {
          [`$${type}`]: { $toDate: '$publish_time' },
        },
        sum: { $sum: 1 },
      },
      },
      { $project: {
        _id: 0,
        [type]: '$_id',
        sum: '$sum',
      },
      },
      { $sort: { _id: 1 } }];
    }
    $facet.monthly = [{ $group: {
      _id: {
        // $substr: [{ $add: [ '$created_at', 28800000 ] }, 0, 10 ]
        $substr: ['$publish_time', 0, 7],
      },
      sum: { $sum: 1 },
    },
    },
    { $project: {
      _id: 0,
      monthly: '$_id',
      sum: '$sum',
    },
    },
    { $sort: { _id: 1 } }];
    console.log($facet);
    return await this.app.model.Weibo.aggregate([
      {
        $match: {
          user_id,
          publish_time: {
            $ne: null,
          },
        },

      },
      { $facet },
      // { $project: {
      //   _id: 0,
      //   publish_time: IOSDate('$publish_time'),
      //   gender: '$gender',
      // }
      // },

    ]);
  }

  /**
   * 查询符合条件的用户总数
   * @param {Object} options 条件
   * @return {Number} 总数
   */
  async count(options) {
    return await this.app.model.Weibo.countDocuments(options);
  }

  async findByUsername(username) {
    return await this.app.model.User.findOne({ username });
  }

  async findById(id) {
    return await this.app.model.User.findById(id);
  }

  async create(user) {
    return await this.service.crud.create(this.app.model.User, user);
  }
}
module.exports = WeiboService;
