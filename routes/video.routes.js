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
//-------------- Get all videos -----------------
videoRoutes.get('/', checkAuth, async (req, res) => {
  const allVideos = await videoModel.find();


  res.status(200).json({
    message: '🟢 All the videos are retrieved successfully 🟢',
    allVideos
  });
});


//----------------- Get all my videos --------------
videoRoutes.get('/my-videos', checkAuth, async (req, res) => {
  const myVideos = await videoModel.find({
    user_id: req.user._id
  });

  res.status(200).json({
    message: '🟢 All the videos of user are retrieved successfully 🟢',
    myVideos
  });
});


//--------- Upload video --------------------------
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


//----------- Update video----------------------
//(it will only change videos meta data like title, description, etc.,)
videoRoutes.put('/update/:id', checkAuth, async (req, res) => {
  try {
    const { title, description, category, tags } = req.body;
    const videoId = req.params.id;

    //Find video by id
    const video = await videoModel.findById(videoId);

    //Error if video does not exists
    if (!video) {
      return res.status(404).json({
        error: '🔴 Video not found 🔴'
      });
    };

    console.log(video);

    //Error if user is unauthorized
    if (video.user_id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        error: '🔴 Unauthorized user 🔴'
      });
    };


    //Updating thumbnail if requested 
    if (req.files && req.files.thumbnail) {
      await cloudinary.uploader.destroy(video.thumbnailId);

      const thumbnailUpload = await cloudinary.uploader.upload(req.files.thumbnail.tempFilePath, { resource_type: 'image', folder: "thumbnail" });

      video.thumbnailUrl = thumbnailUpload.secure_url;
      video.thumbnailId = thumbnailUpload.public_id;
    };

    //Updating other metadata of video
    video.title = title || video.title;
    video.description = description || video.description;
    video.category = category || video.category;
    video.tags = tags || video.tags;

    res.status(200).json({
      message: '🟢 Video Updated successfully 🟢',
    });

  } catch (error) {
    return res.status(500).json({
      error: '🔴 Something went wrong 🔴',
      message: error.message
    });
  };
});


//------------ Delete Video by id -----------------
videoRoutes.delete('/delete/:id', checkAuth, async (req, res) => {
  const videoId = req.params.id;

  //Check if video exist or not
  const video = await videoModel.findById(videoId);

  //Error if video does not exists
  if (!video) {
    return res.status(400).json({
      Error: '🔴 Video not found 🔴'
    });
  };

  // Error : Ensure only the video owner can delete the video
  if (!video.user_id === videoId) {
    return res.status(400).json({
      Error: '🔴You don\'t have access to delete the video 🔴'
    });
  };

  const deletedVideo = await videoModel.deleteOne(
    {
      _id: videoId
    }
  );

  res.status(200).json(
    {
      message: '🟢 Video successfully deleted 🟢',
      deletedVideo
    }
  );
});





//get video by id

//like 


//====================================================
export default videoRoutes;