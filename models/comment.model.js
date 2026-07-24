import mongoose from 'mongoose';


const commentsSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  video_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Video',
    required: true
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  commentText: {
    type: String,
    required: true,
  },
}, { timestamps: true });

const commentModel = mongoose.model('Comment', commentsSchema);

export default commentModel;