import express from "express";
import dotenv from 'dotenv'
import songRoutes from './route.js'
import redis from 'redis'
import cors from 'cors'


dotenv.config({
  path: './.env'
})

export const redisClient = redis.createClient({
  password:process.env.REDIS_PASSWORD as string,
  socket: {
    host:process.env.REDIS_HOST as string,
    port:process.env.REDIS_PORT as unknown as number,  
  },
});

redisClient.connect().then(() => console.log('Redis connected')).catch((err) => console.log(err));


const app = express();
const port = process.env.PORT || 6000

app.use(cors())


app.use("/api/v1" , songRoutes)


app.listen(port , () => {
  console.log(`songservice is running ${port}`);
})