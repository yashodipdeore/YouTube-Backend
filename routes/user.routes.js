import express from "express";
import { Router } from "express";
import bcrypt from 'bcrypt';
import mongoose from "mongoose";
import jwt from 'jsonwebtoken';

//------- Local modules -------
import userModel from '../models/user.model.js';
import videoModel from "../models/video.model.js";
import cloudinary from '../config/cloudinary.js';
import jwtToken from '../config/jwtSecret.js';
//----- Middleware
import { checkAuth } from "../middleware/auth.middleware.js";


//===========================================
//------- Middlewares ------
const userRouters = express.Router();

//===========================================
//---------------- Routes -------------------

//------------ post /api/v1/user/signup------------
userRouters.post('/signup', async (req, res) => {
  try {
    //Password Encryption
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    console.log('Hashed password : ', hashedPassword);

    const uploadImage = await cloudinary.uploader.upload(
      req.files.logoUrl.tempFilePath
    );

    //Creating new user entry
    const newUser = new userModel(
      {
        _id: new mongoose.Types.ObjectId(),
        channelName: req.body.channelName,
        email: req.body.email,
        phone: req.body.phone,
        password: hashedPassword, //Encrypted password
        logoUrl: uploadImage.secure_url,
        logoId: uploadImage.public_id
      }
    );

    //inserting new user entry to DB
    let user = await newUser.save();

    res.status(201).json({
      message: '🟢 Signup successful 🟢',
      user
    });

  } catch (error) {
    console.error(error);
    res.status(401).json({
      error: 'Something went wrong',
      message: error.message
    });
  };
});


//-------- post /api/v1/user/login ----------
userRouters.post('/login', async (req, res) => {
  try {
    //=====================
    //check if user exists or not
    const existingUser = await userModel.findOne({ email: req.body.email });

    //Error if user does not exists
    if (!existingUser) {
      return res.status(404).json({
        message: '🔴 User not found ! 🔴'
      });
    };



    //=====================
    //check if password entered by the use is correct or not
    const isValid = await bcrypt.compare(req.body.password, existingUser.password)

    //Error if password is wrong
    if (!isValid) {
      return res.status(400).json({
        message: '🔴 Invalid Email Or Password 🔴'
      });
    };



    //=====================
    const token = jwt.sign(
      {
        _id: existingUser._id,
        channelName: existingUser.channelName,
        email: existingUser.email,
        phone: existingUser.phone,
        logoId: existingUser.logoId
      },
      jwtToken.secretKey,
      {
        expiresIn: '10d'
      }
    );
    console.log('==== TOKEN ===== \n', token);
    //Response if email and password is correct
    res.status(200).json({
      message: '🟢 Login successful 🟢',
      _id: existingUser._id,
      channelName: existingUser.channelName,
      email: existingUser.email,
      phone: existingUser.phone,
      logoId: existingUser.logoId,
      logoUrl: existingUser.logoUrl,
      token: token,
      subscribers: existingUser.subscribers,
      subscribedChannels: existingUser.subscribedChannels
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: '🔴 Something went wrong 🔴',
      message: error.message
    });
  }
});


//--------- Update Route ------------------
userRouters.put('/update-profile', checkAuth, async (req, res) => {
  try {
    const userId = req.user._id;
    const { channelName, phone } = req.body;
    const updatedData = {
      channelName,
      phone
    };

    if (req.files && req.files.logoUrl) {
      const uploadedImage = await cloudinary.uploader.upload(req.files.logoUrl.tempFilePath);

      updatedData.logoUrl = uploadedImage.secure_url;
      updatedData.logoId = uploadedImage.public_id;
    };

    const updatedUser = await userModel.findByIdAndUpdate(userId, updatedData, { new: true });

    res.status(200).json({
      message: '🟢 User profile updated successfully 🟢',
      updatedUser
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: 'Something went wrong',
      message: error.message
    });
  };
});


//------------ Subscribe ------------------
userRouters.post('/subscribe', checkAuth, async (req, res) => {
  try {
    //current/Logged in user's  "user id"
    const userId = req.user._id;

    //Channel/user to subscribe
    const channelId = req.body.channelId;

    //Error is  user tries to subscribe his/her own channel
    if (userId.toString() === channelId) {
      return res.status(400).json({
        error: "You cannot subscribe to your own channel"
      });
    };


    //Adding subscribed channel to current users subscribed channels list
    const currentUser = await userModel.findByIdAndUpdate(
      userId,
      {
        $addToSet: {
          subscribedChannels: channelId
        }
      }
    );

    //Adding current user as subscriber to the channel
    const subscribedUser = await userModel.findByIdAndUpdate(
      channelId,
      {
        $addToSet: {
          subscribers: userId
        }
      }
    );

    res.status(200).json({
      message: `🟢 subscribed to ${channel.channelNam}🟢`,
      currentUser,
      subscribedUser
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: 'something went wrong',
      message: error.message
    });
  };
});




//===========================================
export default userRouters; 