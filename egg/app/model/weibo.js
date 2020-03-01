module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const UserSchema = new Schema({

    id: { type: String },
    user_id: { type: String },
    content: { type: String },
    original_pictures: { type: String },
    retweet_pictures: { type: String },
    original: { type: Boolean },
    video_url: { type: String },
    publish_place: { type: String },
    publish_time: { type: Date },
    publish_tool: { type: String },
    up_num: { type: Number },
    retweet_num: { type: Number },
    comment_num: { type: Number },

  });

  //   return mongoose.model('User', UserSchema, { freezeTableName: true });
  return mongoose.model('Weibo', UserSchema, 'weibo');
//   https://stackoverflow.com/questions/7486528/mongoose-force-collection-name
};