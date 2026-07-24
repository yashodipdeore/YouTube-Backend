import express from 'express';
import mongoose from "mongoose";
import { Router } from "express";

//------ local modules---------
import commentModel from "../models/comment.model.js";
import { checkAuth } from '../middleware/auth.middleware.js';
import videoModel from '../models/video.model.js';

//-----------------------------------------------
const commentRoute = express.Router();


//==================== Routes=========================
commentRoute.post('/new', checkAuth, async (req, res) => {
  try {
    const { video_id, commentText } = req.body;
    const user = req.user;

    const video = await videoModel.findById(video_id);

    //Error if no video id or comment text is provided
    if (!video || !commentText) {
      return res.status(400).json({
        error: 'Video ID and Comment Text are required'
      });
    };

    const newComment = new commentModel({
      _id: new mongoose.Types.ObjectId,
      video_id: video_id,
      user_id: user._id,
      commentText: commentText
    });

    await newComment.save();

    res.status(200).json({
      message: `You commented (${commentText}) on (${video.title})`,
      newComment
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: 'Something went wrong',
      message: error.message
    });
  };
});


commentRoute.delete('/:commentId', checkAuth, async (req, res) => {
  try {
    const result = await commentModel.findOneAndDelete({
      _id: req.params.commentId,
      user_id: req.user._id,
    });

    if (!result) {
      return res.status(404).json({
        error: "Comment not found or you are not authorized",
      });
    }

    return res.status(200).json({
      message: "Comment deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: 'Something went wrong',
      message: error.message
    });
  }
});


commentRoute.put('/:commentId', checkAuth, async (req, res) => {
  try {
    const { commentText } = req.body;

    const UpdatedComment = await commentModel.findOneAndUpdate(
      {
        _id: req.params.commentId,
        user_id: req.user._id
      },
      {
        $set: {
          commentText: commentText
        }
      },
      {
        new: true,
        runValidators: true
      }
    );

    //Error if user if Unauthorized or comment not found
    if (!UpdatedComment) {
      return res.status(404).json({
        error: "Comment not found or you are not authorized",
      });
    };

    res.status(200).json({
      message: 'Comment updated successfully'
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: error,
      message: error.message
    });
  }
});


//-------------------------------------------------
export default commentRoute;