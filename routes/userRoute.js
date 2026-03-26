import express from 'express'
const router = express.Router();
import userModel from '../models/userModel.js';

// sign-up route
router.post('/signup',async(req,resp)=>{
try {
  const {name,email,password} = req.body;
  const exitUser = await userModel.findOne({email:email})
  if(exitUser){
    return resp.json({success:false,message:'user already exists'})
  }
  const newUser = new userModel({name,email,password})
  await newUser.save();
  resp.json({message:'user registered succcesfully',user:newUser})
} catch (error) {
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
export default router;