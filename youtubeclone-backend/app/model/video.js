
module.exports = (app) => {
    const mongoose = app.mongoose;
    const Schema = mongoose.Schema;
  
    const VideoSchema = new Schema({
      title: {
        type: String,
        required: true
      },
      description: {
        type: String,
        required: true
      },
      playUrl: {
        type: String,
        select: false,
        required: true
      },
      cover: {
        type: String,
        default: null
      },
      user: {
        type: mongoose.ObjectId,
        required: true,
        ref: 'User'
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
  
    return mongoose.model("Video", VideoSchema);
  };
  