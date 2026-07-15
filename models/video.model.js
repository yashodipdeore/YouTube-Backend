import mongoose, { mongo } from "mongoose";

const videoSchema = new mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    videoUrl: {
      type: String,
      required: true,
      trim: true,
    },
    thumbnailUrl: {
      type: String,
      required: true,
      trim: true,
    },
    thumbnailId: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    tags: [{
      type: String,
      trim: true,
    },
    ],
    likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
    disLikedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
    viewedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
  },
  {
    timestamps: true
  }
);



const videoModel = mongoose.model('Video', videoSchema);

export default videoModel;
