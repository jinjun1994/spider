module.exports = app => {
  const { STRING, INTEGER, DATE } = app.Sequelize;
  const tableName = 'wechat_article_list';
  const WechatArticleList = app.wechatModel.define(tableName, {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    biz: {
      type: STRING(50),
      field: '__biz',
    },
    title: STRING(255),
    digest: STRING(2000),
    url: STRING(500),
    source_url: STRING(1000),
    cover: STRING(255),
    subtype: INTEGER(11),
    is_multi: INTEGER(11),
    author: STRING(255),
    copyright_stat: INTEGER(11),
    duration: INTEGER(11),
    del_flag: INTEGER(11),
    type: INTEGER(11),
    publish_time: DATE,
    sn: STRING(50),
    spider_time: DATE,
  }, {
    tableName,
    createdAt: false,
    updatedAt: false,
  });

  return WechatArticleList;
};
