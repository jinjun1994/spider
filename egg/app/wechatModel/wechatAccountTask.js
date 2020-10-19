module.exports = app => {
  const { STRING, INTEGER, DATE } = app.Sequelize;
  const tableName = 'wechat_account_task';
  const WechatAccountTask = app.wechatModel.define(tableName, {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    biz: {
      type: STRING(50),
      field: '__biz',
    },
    last_publish_time: DATE, // '上次抓取到的文章发布时间，做文章增量采集用',
    last_spider_time: DATE, // '上次抓取时间，用于同一个公众号每隔一段时间扫描一次',
    is_zombie: INTEGER(11), // DEFAULT '0' COMMENT '僵尸号 默认3个月未发布内容为僵尸号，不再检测',
  }, {
    tableName,
    createdAt: false,
    updatedAt: false,
  });


  return WechatAccountTask;
};
