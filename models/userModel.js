import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
  name:String,
  email:String,
  password:String,
  image:String,
  followers:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:'User'
  }],
  following:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:'User'
  }]
}, {timestamps:true})
export default mongoose.model('User',userSchema)