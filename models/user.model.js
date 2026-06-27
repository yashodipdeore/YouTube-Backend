import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  channelName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  logoUrl: {
    type: String,
    required: true,
  },
  logoId: {
    type: String,
    required: true,
  },
  subscribers: {
    type: Number,
    default: 0
  },
  subscribedChannels: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }]
}, { timestamps: true });


const userModel = mongoose.model('User', userSchema);

export default userModel;