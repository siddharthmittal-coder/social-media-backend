import express from 'express';
const router = express.Router();
import userModel from '../models/userModel.js';
import postModel from '../models/postModel.js';
import {v2 as cloudinary} from 'cloudinary'
import multer from 'multer'
import dotenv from 'dotenv'
dotenv.config();
cloudinary.config({
  cloud_name:process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY
})
// multer setup for file uploaders
const uploads = multer({dest: 'uploads/'})
// create post route
router.post('/createpost',uploads.single('image'),async(req,resp)=>{
  try {
    const {userId,content} = req.body;
    let imageUrl = '';
    if(req.file){
      const result = await cloudinary.uploader.upload(req.file.path);
      imageUrl = result.secure_url;
    }
    const user = await userModel.findById(userId);
    if(!user){
      return resp.json({success:false,message:'user not found'})
    
    }
    const newPost = new postModel({
      userId,
      username:user.name,
      UserProfilePic: user.image,
      content,
      image: imageUrl,
      likes:[],
      comments:[]
    })
    await newPost.save();
    resp.json({success:true,message:'Post created successfully',post:newPost})
  } catch (error) {
    resp.json({success:false,message:'Error creating post',error:error.message})
  }
})
// get all post route
router.get('/allposts',async(req,resp)=>{
try {
  const posts = await postModel.find().sort({createdAt:-1})
  resp.json({success:true,message:'Posts retrieved successfully',posts})
} catch (error) {
  resp.json({success:false,message:'Error retrieving posts',error:error.message})
}
})
// like post route
router.post("/like", async (req, res) => {
  try {
    const { postId, userId } = req.body;

    const post = await postModel.findById(postId);

    if (!post) {
      return res.json({ success: false, message: "Post not found" });
    }

    // check if already liked
    const alreadyLiked = post.likes.includes(userId);

    if (alreadyLiked) {
      // unlike
      post.likes = post.likes.filter(
        (id) => id.toString() !== userId
      );
    } else {
      // like
      post.likes.push(userId);
    }

    await post.save();

    res.json({
      success: true,
      // totalLikes: post.likes.length
      likes:post.likes
    });

  } catch (err) {
    res.status(500).json({ success: false });
  }
});
// comment on post route
router.post("/comment", async (req, res) => {
  try {
    const { postId, userId, text } = req.body;

    const post = await postModel.findById(postId);
    const user = await userModel.findById(userId)
    
    if (!post || !user) {
      return res.json({ success: false, message: "Post not found" });
    }

    post.comments.push({
      userId,
      username:user.name,
      text
    });

    await post.save();

    res.json({
      success: true,
      comments: post.comments
    });

  } catch (err) {
    res.status(500).json({ success: false });
  }
});
export default router;