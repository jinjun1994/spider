'use strict';

const Service = require('egg').Service;
const { Op } = require('sequelize');
class WechatArticle extends Service {
  async list(Options) {
    const { ctx } = this;
    return this.ctx.wechatModel.WechatArticle.findAndCountAll({
      where: { ...Options,
        id: {
          [Op.ne]: null
        }
      },
      attributes: { exclude: [ 'content_html' ] }, // 排除该字段

      ...(ctx.query.full === 'true' ? {} : ctx.helper.mysqlPageQuery(ctx.query))
    //   order: [[ 'created_at', 'desc' ], [ 'id', 'desc' ]],
    });
  }

  async find(id) {
    const article = await this.ctx.wechatModel.WechatArticle.findByPk(id, {
      attributes: { exclude: [ 'content_html' ] },
    });
    if (!article) {
      this.ctx.throw(404, 'article not found');
    }
    return article;
  }
  async findOneByOptions(Options) {
    const article = await this.ctx.wechatModel.WechatArticle.findOne({ where: Options });
    // if (!articles) {
    //   this.ctx.throw(404, 'articles not found');
    // }
    return article;
  }

  async create(article) {
    return await this.ctx.wechatModel.WechatArticle.create(article);
  }
  async creates(list) {
    return await this.ctx.wechatModel.WechatArticle.bulkCreate(list, { validate: true });
  }

  async update({ id, updates }) {
    const article = await this.ctx.wechatModel.WechatArticle.findByPk(id);
    if (!article) {
      this.ctx.throw(404, 'article not found');
    }
    return article.update(updates);
  }

  async del(id) {
    const article = await this.ctx.wechatModel.WechatArticle.findByPk(id);
    if (!article) {
      this.ctx.throw(404, 'article not found');
    }
    return article.destroy();
  }
}

module.exports = WechatArticle;