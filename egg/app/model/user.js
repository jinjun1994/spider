module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const UserSchema = new Schema({

    id: { type: String },
    nickname: { type: String },
    weibo_num: { type: Number },
    following: { type: Number },
    followers: { type: Number },
    // 定义爬虫内容


    // 文件路径
    file: { },

    // 已经抓取到的时间
    time: { type: Date },
    lastSuccessTime: { type: Date },
    /**
     * 执行状态
     * 0，未执行
     * 1，执行过
     * 2，执行中
     * 4，执行成功
     * 4，失败
     */
    status: { type: Number, required: true, default: 0 },


  });
  UserSchema.index({ id: 1 });
  //   return mongoose.model('User', UserSchema, { freezeTableName: true });
  return mongoose.model('User', UserSchema, 'user');
//   https://stackoverflow.com/questions/7486528/mongoose-force-collection-name
};