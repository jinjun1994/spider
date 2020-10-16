module.exports = app => {
  const { STRING, INTEGER, DATE } = app.Sequelize;
  const tableName = 'wechat_account';
  const WechatAccount = app.wechatModel.define(tableName, {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    // __biz: STRING(50), 这样写会报错
    biz: {
      type: STRING(50),
      field: '__biz',
    },
    account: STRING(255),
    head_url: STRING(255),
    summary: STRING(500),
    qr_code: STRING(255),
    verify: STRING(255),
    spider_time: DATE
  }, {
    tableName,
    createdAt: false,
    updatedAt: false,
  });
  WechatAccount.associate = function() {
    app.wechatModel.WechatAccount.hasOne(app.wechatModel.WechatAccountTask, { foreignKey: 'biz', as: 'accountTask' });
  };
  return WechatAccount;
};