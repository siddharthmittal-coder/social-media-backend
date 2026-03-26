import mongoose from "mongoose";
const postSchema = new mongoose.Schema({
  userId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'User',
  },
  username:String,
  content:String,
  image:String,
  likes:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:'User',
  }],
  comments:[
    {
      userId :{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
      },
      username:String,
      text:String,
      createdAt:{
        type:Date,
        default:Date.now
      }
      }
    
  ]
},{timestamps:true})
export default mongoose.model('post',postSchema)