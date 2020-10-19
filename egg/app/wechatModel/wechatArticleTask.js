module.exports = app => {
  const { STRING, INTEGER } = app.Sequelize;
  const tableName = 'wechat_article_task';
  const WechatArticleTask = app.wechatModel.define(tableName, {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    biz: {
      type: STRING(50),
      field: '__biz',
    },
    sn: STRING(50),
    article_url: STRING(255),
    state: INTEGER(11), // DEFAULT '0' COMMENT '文章抓取状态，0 待抓取 2 抓取中 1 抓取完毕 -1 抓取失败',
  }, {
    tableName,
    createdAt: false,
    updatedAt: false,
    indexes: [
      { unique: 'sn', fields: ['sn'] },
      { fields: ['state'] },
    ],
  });

  return WechatArticleTask;
};
