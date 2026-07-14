//External modules
import express from 'express';
import mongoose from 'mongoose';
import { Router } from 'express';

//===== Local Modules ========
import userModel from '../models/user.model.js';
import videoModel from '../models/video.model.js';
import cloudinary from '../config/cloudinary.js';



//====================================================
const videoRoutes = express.Router();


export default videoRoutes;