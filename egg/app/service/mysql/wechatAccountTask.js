'use strict';

const Service = require('egg').Service;

class WechatAccountTask extends Service {
  async list(Options) {
    const { ctx } = this;
    return this.ctx.wechatModel.WechatAccountTask.findAndCountAll({
      where: Options,
      ...(ctx.query.full === 'true' ? {} : ctx.helper.mysqlPageQuery(ctx.query)),
    //   order: [[ 'created_at', 'desc' ], [ 'id', 'desc' ]],
    });
  }

  async find(id) {
    const task = await this.ctx.wechatModel.WechatAccountTask.findByPk(id);
    if (!task) {
      this.ctx.throw(404, 'task not found');
    }
    return task;
  }

  async create(task) {
    return await this.ctx.wechatModel.WechatAccountTask.create(task);
  }
  async creates(list) {
    return await this.ctx.wechatModel.WechatAccountTask.bulkCreate(list, { validate: true });
  }

  async update({ id, updates }) {
    const task = await this.ctx.wechatModel.WechatAccountTask.findByPk(id);
    if (!task) {
      this.ctx.throw(404, 'task not found');
    }
    return task.update(updates);
  }

  async del(id) {
    const task = await this.ctx.wechatModel.WechatAccountTask.findByPk(id);
    if (!task) {
      this.ctx.throw(404, 'task not found');
    }
    return task.destroy();
  }
}

module.exports = WechatAccountTask;