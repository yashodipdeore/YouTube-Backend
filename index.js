import express from 'express';
import dotenv from 'dotenv';
import fileUpload from 'express-fileupload';
import bodyParser from 'body-parser';


//--------- Local modules -----------------
import { ConnectDB } from './config/db.config.js';
import userRoutes from './routes/user.routes.js';
import videoRoutes from './routes/video.routes.js';

//===========================================
dotenv.config(); // .env File configuration

const app = express(); // App

ConnectDB(); //DB-Connection

//Middleware to convert "json" object into js Objects.
app.use(express.json());

//Middleware to to store files temporary in temp dir when they are being uploaded on cloudinary.
app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: '/temp/'
}));

//User Router
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/video', videoRoutes);


//=========== ROUTES ========================



//============================================
app.listen(process.env.PORT, () => {
  console.log(`server is running at : http://localhost:${process.env.PORT}`);
});