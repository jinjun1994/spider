module.exports = app => {
  const { mongoose } = app;
  const { Schema } = mongoose;

  const UserSchema = new Schema({
    // 公众号相关信息
    biz: { type: String },

    // bookinfo
    // 微信读书中公众号形式书籍id
    bookId: { type: String },
    // 微信读书中公众号形式书籍名称   公众号名称
    title: { type: String },
    // 微信读书中公众号形式书籍封面 也就是公众号头像
    cover: { type: String },
    // 简介
    intro: { type: String },


    // 定义爬虫内容

    // 发布的第一篇文章的发布当天 0 点的时间
    firstPublishAt: Date,
    // 最近一次的发布时间
    latestPublishAt: Date,
    // 已经抓取到的时间
    time: { type: Date },
    lastSuccessTime: { type: Date },


  });
  UserSchema.index({ id: 1 });
  //   return mongoose.model('User', UserSchema, { freezeTableName: true });
  return mongoose.model('WechatAccount', UserSchema, 'wechatAccount');
  //   https://stackoverflow.com/questions/7486528/mongoose-force-collection-name
};
