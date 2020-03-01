module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const UserSchema = new Schema({

    id: { type: String },
    nickname: { type: String },
    weibo_num: { type: Number },
    following: { type: Number },
    followers: { type: Number },

  });

  //   return mongoose.model('User', UserSchema, { freezeTableName: true });
  return mongoose.model('User', UserSchema, 'user');
//   https://stackoverflow.com/questions/7486528/mongoose-force-collection-name
};