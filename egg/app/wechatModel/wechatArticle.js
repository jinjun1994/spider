module.exports = app => {
  const { STRING, INTEGER, DATE, TEXT } = app.Sequelize;
  const tableName = 'wechat_article';
  const WechatArticle = app.wechatModel.define(tableName, {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    biz: {
      type: STRING(50),
      field: '__biz',
    },
    account: STRING(255),
    title: STRING(255),
    url: STRING(255),
    author: STRING(255),
    publish_time: DATE,
    digest: STRING(255),
    cover: STRING(255),
    pics_url: TEXT,
    content_html: TEXT,
    source_url: STRING(255),
    comment_id: STRING(50),
    sn: STRING(50),
    spider_time: DATE,
  }, {
    tableName,
    createdAt: false,
    updatedAt: false,
  });

  return WechatArticle;
};