module.exports = app => {
  const { STRING, INTEGER, DATE } = app.Sequelize;
  const tableName = 'wechat_article_comment';
  const WechatArticleComment = app.wechatModel.define(tableName, {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    biz: {
      type: STRING(50),
      field: '__biz',
    },
    comment_id: STRING(50), // '与文章关联'
    nick_name: STRING(255),
    logo_url: STRING(255),
    content: STRING(2000),
    create_time: DATE,
    content_id: STRING(50), // '本条评论内容的id'
    like_num: INTEGER(11),
    is_top: INTEGER(11),
    spider_time: DATE,
  }, {
    tableName,
    createdAt: false,
    updatedAt: false,
  });

  return WechatArticleComment;
};
