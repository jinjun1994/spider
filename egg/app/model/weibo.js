module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const WeiboSchema = new Schema({

    id: { type: String }, // 微博id
    user_id: { type: String }, // 作者id
    content: { type: String }, // 内容
    original_pictures: { type: String }, // 原创图片url
    retweet_pictures: { type: String }, // 转发图片url
    original: { type: Boolean }, // 是否原创微博
    video_url: { type: String }, // 微博视频url
    publish_place: { type: String },
    publish_time: { type: Date },
    publish_tool: { type: String },
    up_num: { type: Number },
    retweet_num: { type: Number },
    comment_num: { type: Number },

  });
  WeiboSchema.index({ id: 1, user_id: 1, publish_time: 1, content: 1 }, { unique: true });
  //   return mongoose.model('User', WeiboSchema, { freezeTableName: true });
  return mongoose.model('Weibo', WeiboSchema, 'weibo');
//   https://stackoverflow.com/questions/7486528/mongoose-force-collection-name
};