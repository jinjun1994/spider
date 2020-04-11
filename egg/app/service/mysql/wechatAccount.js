'use strict';

const Service = require('egg').Service;

class WechatAccount extends Service {
  async list({ offset = 0, limit = 10 } = {}) {
    return this.ctx.wechatModel.WechatAccount.findAndCountAll({
      offset,
      limit,
    //   order: [[ 'created_at', 'desc' ], [ 'id', 'desc' ]],
    });
  }

  async find(id) {
    const user = await this.ctx.wechatModel.WechatAccount.findByPk(id);
    if (!user) {
      this.ctx.throw(404, 'user not found');
    }
    return user;
  }
  async findOneByOptions(Options) {
    const user = await this.ctx.wechatModel.WechatAccount.findOne({ where: Options });
    // if (!user) {
    //   this.ctx.throw(404, 'user not found');
    // }
    return user;
  }

  async create(user) {
    return await this.ctx.wechatModel.WechatAccount.create(user);
  }
  async creates(list) {
    return await this.ctx.wechatModel.WechatAccount.bulkCreate(list, { validate: true });
  }

  async update({ id, updates }) {
    const user = await this.ctx.wechatModel.WechatAccount.findByPk(id);
    if (!user) {
      this.ctx.throw(404, 'user not found');
    }
    return user.update(updates);
  }

  async del(id) {
    const user = await this.ctx.wechatModel.WechatAccount.findByPk(id);
    if (!user) {
      this.ctx.throw(404, 'user not found');
    }
    return user.destroy();
  }
}

module.exports = WechatAccount;