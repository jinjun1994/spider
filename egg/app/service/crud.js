'use strict';
const Service = require('egg').Service;
const msg = require('./msg');

class CrudService extends Service {

  /**
   * 将字符串转换为 ObjectId
   * @param {String} id id
   * @return {ObjectId} ObjectId
   */
  objectId(id) {
    return this.app.mongoose.Types.ObjectId(id);
  }


  async index(service, options) {
    const { total, full, populate } = this.ctx.query;
    const query = { populate: populate === 'true' };
    const { skip, limit, sort } = this.ctx.helper.pageQuery(this.ctx.query);
    query.sort = sort;
    if (!(full === 'true')) {
      query.skip = skip;
      query.limit = limit;
    }
    const list = await service.list(options, query);
    if (total === 'true') {
      const count = await service.count(options);
      return { list, total: count };
    } else {
      return { list };
    }
  }
  /**
   * create 成功返回 msg.ok，失败则直接返回 err，其中含有校验错误信息
   * @param {*} model mongoose 模型
   * @param {*} obj 待保存对象
   * @return {msg} 消息
   */
  async create(model, obj) {
    try {
      const result = await new model(obj).save({ runValidators: true, context: 'query' });
      return msg.noErr(result._id);
    } catch (err) {
      this.ctx.logger.warn(err);
      return msg.createErr(err);
    }
  }
  /**
   * update 成功返回 msg.ok，失败则直接返回 err，其中含有校验错误信息
   * @param {*} model mongoose 模型
   * @param {*} id _id
   * @param {*} obj 待更新对象
   * @return {msg} 消息
   */
  async update(model, id, obj) {
    try {
      const res = await model.findOneAndUpdate({ _id: id }, obj,
        { runValidators: true, context: 'query', new: true });
      return msg.noErr(res);
    } catch (err) {
      this.ctx.logger.warn(err);
      // 只有一个 castError 的情况下 err 中不是一个 errors 对象
      // 需手工转换，其他情况待观察
      // if (err.path) {
      //   const errors = {};
      //   errors[err.path] = err;
      //   return { errors };
      // }
      // return err;
      return msg.updateErr(err);
    }
  }

  /**
   * remove 成功或失败均返回统一的 msg 格式
   * @param {*} model mongoose 模型
   * @param {*} id 待删除对象 id
   * @return {msg} 消息
   */
  async remove(model, id) {
    try {
      const found = await model.findByIdAndRemove(id);
      if (found) {
        return msg.ok;
      }
      return msg.notFoundErr();

    } catch (err) {
      this.ctx.logger.warn(err);
      return msg.removeErr(err);
    }
  }
}

module.exports = CrudService;
