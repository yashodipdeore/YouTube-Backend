//External modules
import express from 'express';
import mongoose from 'mongoose';
import { Router } from 'express';

//===== Local Modules ========
import userModel from '../models/user.model.js';
import videoModel from '../models/video.model.js';
import cloudinary from '../config/cloudinary.js';
import { checkAuth } from '../middleware/auth.middleware.js';


//====================================================
const videoRoutes = express.Router();


//====================================================
//Upload video
videoRoutes.post('/upload', checkAuth, async (req, res) => {
  try {
    //============================================================
    //Extracting request body data
    const { title, description, category, tags } = req.body;

    //Error if thumbnail or video is not provided
    if (!req.files || !req.files.video || !req.files.thumbnail) {
      return res.status(400).json({
        error: '🔴Video and thumbnail are required 🔴',
      });
    };


    //============================================================
    //Uploading video on cloudinary
    const videoUpload = await cloudinary.uploader.upload
      (
        req.files.video.tempFilePath,
        {
          resource_type: 'video',
          folder: 'videos'
        }
      );

    //Uploading thumbnail on cloudinary
    const thumbnailUpload = await cloudinary.uploader.upload
      (
        req.files.thumbnail.tempFilePath,
        {
          resource_type: 'image',
          folder: 'thumbnails'
        }
      );

    // Storing video to DB
    const newVideo = new videoModel({
      _id: new mongoose.Types.ObjectId(),
      title,
      description,
      user_id: req.user._id,
      videoUrl: videoUpload.secure_url,
      videoId: videoUpload.public_id,
      thumbnailUrl: thumbnailUpload.secure_url,
      thumbnailId: thumbnailUpload.public_id,
      category,
      tags: tags ? tags.split(',') : [],
    });

    //Save newVideo to DB
    await newVideo.save();

    //sending response back to user
    res.status(200).json({
      message: '🟢 Video uploaded successfully 🟢',
      video: newVideo
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: '🔴 Something went wrong 🔴',
      message: error.message
    });
  }
});






//====================================================
export default videoRoutes;