
module.exports = (app) => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const UserSchema = new Schema({
    username: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    password: {
      type: String,
      select: false,
      required: true
    },
    avatar: {
      type: String,
      required: true
    },
    cover: {
      type: String,
      default: null
    },
    channelDescription: {
      type: String,
      default: null
    },
    subscribersCount: {
      type: Number,
      default: 0
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  })

  return mongoose.model("User", UserSchema);
};
