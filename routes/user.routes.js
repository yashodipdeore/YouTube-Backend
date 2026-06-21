import express from "express";
import { Router } from "express";


//===========================================
const router = Router();


//===========================================
router.post('/signup', (req, res) => {
  res.send('Hii Buddy...');
});




//===========================================
export default router;