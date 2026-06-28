import express from "express";
import { Router } from "express";
import bcrypt from 'bcrypt';
import mongoose from "mongoose";

//------- Local modules -------
import User from '../models/user.model.js';
import cloudinary from '../config/cloudinary.js';

//===========================================
//------- Middlewares ------
const router = Router();


//===========================================
//-------- Routes -----------

router.post('/signup', async (req, res) => {
  try {
    //Password Encryption
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    console.log('Hashed password : ', hashedPassword);

    const uploadImage = await cloudinary.uploader.upload(
      req.files.logoURL.tempFilePath
    );
    console.log('IMAGE ', uploadImage);


    //Creating new user entry
    const newUser = new User(
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
      user
    });

  } catch (err) {
    console.error(err);
    res.status(401).json({
      //inserting new user entry to DB
      message: err.message
    });
  };
});



//===========================================
export default router;