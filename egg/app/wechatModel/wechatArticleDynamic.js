module.exports = app => {
  const { STRING, INTEGER, DATE } = app.Sequelize;
  const tableName = 'wechat_article_dynamic';
  const WechatArticleDynamic = app.wechatModel.define(tableName, {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    biz: {
      type: STRING(50),
      field: '__biz',
    },
    sn: STRING(50),
    read_num: INTEGER(11),
    like_num: INTEGER(11),
    comment_count: INTEGER(11),
    spider_time: DATE,
  }, {
    tableName,
    createdAt: false,
    updatedAt: false,
  });

  return WechatArticleDynamic;
};
