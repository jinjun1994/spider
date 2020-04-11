'use strict';

const Service = require('egg').Service;

class WechatArticleTask extends Service {
  async list({ offset = 0, limit = 10 } = {}) {
    return this.ctx.wechatModel.WechatArticleTask.findAndCountAll({
      offset,
      limit,
    //   order: [[ 'created_at', 'desc' ], [ 'id', 'desc' ]],
    });
  }

  async find(id) {
    const user = await this.ctx.wechatModel.WechatArticleTask.findByPk(id);
    if (!user) {
      this.ctx.throw(404, 'user not found');
    }
    return user;
  }

  async create(user) {
    return await this.ctx.wechatModel.WechatArticleTask.create(user);
  }
  async creates(list) {
    return await this.ctx.wechatModel.WechatArticleTask.bulkCreate(list, { validate: true });
  }

  async update({ id, updates }) {
    const user = await this.ctx.wechatModel.WechatArticleTask.findByPk(id);
    if (!user) {
      this.ctx.throw(404, 'user not found');
    }
    return user.update(updates);
  }

  async del(id) {
    const user = await this.ctx.wechatModel.WechatArticleTask.findByPk(id);
    if (!user) {
      this.ctx.throw(404, 'user not found');
    }
    return user.destroy();
  }
}

module.exports = WechatArticleTask;