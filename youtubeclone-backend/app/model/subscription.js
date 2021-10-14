
module.exports = (app) => {
    const mongoose = app.mongoose;
    const Schema = mongoose.Schema;
  
    const SubscriptionSchema = new Schema({
      user: {
        type: mongoose.ObjectId,
        required: true,
        ref: 'User'
      },
      channel: {
        type: mongoose.ObjectId,
        required: true,
        ref: 'Video'
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
  
    return mongoose.model("Subscription", SubscriptionSchema);
  };
  