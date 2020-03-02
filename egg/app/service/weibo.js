'use strict';

const Service = require('egg').Service;


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
    const { skip, limit, sort } = query;
    const params = { sort: sort ? sort : { time: -1 } };

    if (skip !== undefined && limit !== undefined) {
      params.skip = skip;
      params.limit = limit;
    }
    return await this.app.model.Weibo.find(options, null, params);
  }

  async listWithCooperations(options, query) {
    const { skip, limit } = query;
    const params = { sort: { username: 1 }, collation: { locale: 'zh' } };
    if (skip !== undefined && limit !== undefined) {
      params.skip = skip;
      params.limit = limit;
    }
    const aggregateOptions =
      [{ $match: options },
        {
          $lookup: {
            from: 'cooperation',
            localField: '_id',
            foreignField: 'collaborator',
            as: 'projects',
          },
        },
      ];

    if (skip !== undefined && limit !== undefined) {
      aggregateOptions.push({ $skip: skip });
      aggregateOptions.push({ $limit: limit });
    }
    return await this.app.model.User.aggregate(aggregateOptions).collation({ locale: 'zh' });

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
