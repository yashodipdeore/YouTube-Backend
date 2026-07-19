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

  if (!allVideos) {
    return res.status(400).json({
      Error: '🔴 Videos not found 🔴'
    });
  };

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

  if (!myVideos) {
    return res.status(400).json({
      Error: '🔴 Video not found 🔴'
    });
  };

  res.status(200).json({
    message: '🟢 All the videos of user are retrieved successfully 🟢',
    myVideos
  });
});


//----------- Get video by id ------------------------
videoRoutes.get('/:id', checkAuth, async (req, res) => {
  const videoId = req.params.id;
  if (!videoId) {
    return res.status(400).json({
      Error: '🔴 Video id is not provided 🔴'
    });
  };

  const video = await videoModel.findById({
    _id: videoId
  });

  if (!video) {
    return res.status(400).json({
      Error: '🔴 Video not Found 🔴'
    });
  };

  res.status(200).json({
    message: 'Video found',
    video
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
    if (!videoId) {
      return res.status(404).json({
        error: '🔴 Video Id is not provided 🔴'
      });
    };

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

    await video.save();

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

  await deletedVideo.save();

  res.status(200).json(
    {
      message: '🟢 Video successfully deleted 🟢',
      deletedVideo
    }
  );
});


//--------- Like video by id----------------
videoRoutes.post('/:id/like', checkAuth, async (req, res) => {
  const videoId = req.params.id;
  const userId = req.user._id;

  const video = await videoModel.findById(videoId);

  //Error : if video not found
  if (!video) {
    return res.status(404).json({
      Error: '🔴 Video not found 🔴'
    });
  };

  //Error: if video is already liked
  if (video.likedBy.includes(userId)) {
    return res.status(400).json({
      Error: 'You have already liked the video'
    });
  };


  await video.disLikedBy.pull(userId);


  await video.likedBy.push(userId);


  await video.save();

  res.status(200).json({
    message: '🟢 Video liked successfully 🟢',
    video,
    totalLikes: video.likes
  });
});


//--------- dislike video by id------------
videoRoutes.post('/:id/dislike', checkAuth, async (req, res) => {
  const videoId = req.params.id;
  const userId = req.user._id;

  const video = await videoModel.findById(videoId);

  if (!video) {
    return res.status(404).json({
      Error: '🔴 Video not found 🔴'
    });
  };


  if (video.disLikedBy.includes(userId)) {
    return res.status(400).json({
      Error: '🔴 You have already disliked the video 🔴'
    });
  };

  await video.likedBy.pull(userId);

  await video.disLikedBy.push(userId);

  await video.save();

  res.status(200).json({
    message: '🟢 video disliked successfully🟢',
    video,
    Total_disliked: video.disLikes
  });
});


//====================================================
export default videoRoutes;