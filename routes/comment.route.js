import express from 'express';
import mongoose from "mongoose";
import { Router } from "express";

//------ local modules---------
import commentModel from "../models/comment.model.js";
import checkAuth from '../middleware/auth.middleware.js';

//-----------------------------------------------
const commentRoute = express.Router();


//==================== Routes=========================






//-------------------------------------------------
export default commentRoute;