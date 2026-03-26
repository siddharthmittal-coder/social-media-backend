import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoute from './routes/userRoute.js';
import postRoute from './routes/postRoute.js';
dotenv.config();
mongoose.connect(process.env.MONGODB_URL)
.then(() =>console.log("Mongodb connected"))
.catch((err)=>console.log(err));
const app = express();
app.use(express.json());
app.use(cors());
app.use('/api/user',userRoute);
app.use('/api/post',postRoute);
app.get('/',(req,resp)=>{
  resp.send('Home page')
})
app.listen(5000,()=>{
  console.log('Server is running on port 5000');
})