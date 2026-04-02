import express from 'express'
const router = express.Router();
import userModel from '../models/userModel.js';
import {v2 as cloudinary} from 'cloudinary'
import multer from 'multer'
import dotenv from 'dotenv'
dotenv.config();
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY
})
// multer setup for file uploaders
const upload = multer({dest:'uploads/'})
// sign-up route
router.post('/signup',upload.single('image'),async(req,resp)=>{
try {
  const {name,email,password} = req.body;
  
  
  let imageUrl = '';
  if(req.file){
    const result = await cloudinary.uploader.upload(req.file.path);
    imageUrl = result.secure_url;
  }
  const exitUser = await userModel.findOne({email:email})
  if(exitUser){
    return resp.json({success:false,message:'user already exists'})
  }
  const newUser = new userModel({name,email,password,image:imageUrl})
  await newUser.save();
  resp.json({message:'user registered succcesfully',user:newUser})
} catch (error) {
  console.log(error)
  resp.status(500).json({success:false,message:'internal server error'})
}
})
// Login route
router.post('/login',async(req,resp)=>{
  try {
    const {email,password} = req.body;
    const user = await userModel.findOne({email,password})
    if(!user){
      resp.json({success:false,message:'Invalid credentaials'})
    }
    resp.json({success:true,message:'Login successful',user})
  } catch (error) {
    resp.status(500).json({success:false,message:'internal server error'})
  }
})
// follow user route
router.post('/follow',async(req,resp) =>{
  
  try {
    const {currentUserId,followingUserId} = req.body;
    const currentUser = await userModel.findById(currentUserId);
    const followingUser = await userModel.findById(followingUserId);
    if(!currentUser || !followingUser){
      return resp.json({success:false,message:'User not found'})
    }
    const alreadyFollowing = currentUser.following.includes(followingUserId);
    if(alreadyFollowing){
      currentUser.following = currentUser.following.filter(userId => userId.toString()!== followingUserId);
      followingUser.followers = followingUser.followers.filter(userId => userId.toString() !== currentUserId);
    } else{
      currentUser.following.push(followingUserId);
      followingUser.followers.push(currentUserId)
    }
    await currentUser.save();
    await followingUser.save();
    resp.json({success:true,message:alreadyFollowing? 'Unfollowed successfully' : 'Followed successfully'})
  } catch (error) {
    resp.status(500).json({success:false,message:'internal server error'})
  }
})
export default router;