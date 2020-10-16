'use strict';

const Service = require('egg').Service;

class WechatAccount extends Service {
  async list(Options) {
    const { ctx } = this;
    return this.ctx.wechatModel.WechatAccount.findAndCountAll({
      where: Options,
      ...(ctx.query.full === 'true' ? {} : ctx.helper.mysqlPageQuery(ctx.query)),
      // order: [[ 'publish_time', 'desc' ]],
      include: [{
        model: this.app.wechatModel.WechatAccountTask,
        as: 'accountTask',
        // attributes: [ 'userName' ]
      }],
    });
  }

  async find(id) {
    const account = await this.ctx.wechatModel.WechatAccount.findByPk(id);
    if (!account) {
      this.ctx.throw(404, 'user not found');
    }
    return account;
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