import express from "express";
import dotenv from 'dotenv'
import mongoose from "mongoose";
import userRoutes from './route.js'




const connectDB = async () => {
  try {
    mongoose.connect(process.env.MONGO_URI as string,{
      dbName:"Spotify"
    }).then(()=>{
      console.log("MongoDB connected successfully");
    })
    
  } catch (error) {
    console.log(error);
    
  }
}

dotenv.config({
  path: '../.env'
})

const app = express();
app.use(express.json());
const port = process.env.PORT || 5000


app.use("/api/v1", userRoutes)

app.get('/', (req, res) => {
  res.send('hello world')
})

app.listen(port, () => {
  console.log(`server is running ${port}`);
  connectDB()
})