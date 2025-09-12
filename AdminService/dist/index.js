import express from 'express';
import dotenv from 'dotenv';
import { sql } from './config/db.js';
import adminRoutes from './route.js';
import cloudinary from 'cloudinary';
import redis from 'redis';
import cors from 'cors';
dotenv.config({
    path: './.env'
});
export const redisClient = redis.createClient({
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
    },
});
redisClient.connect().then(() => console.log("connected to redis")).catch(err => console.log(err));
cloudinary.v2.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
});
const app = express();
app.use(cors());
app.use(express.json());
async function initDB() {
    try {
        await sql `
    CREATE TABLE IF NOT EXISTS albums (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL UNIQUE,
      discription VARCHAR(255) NOT NULL,
      thumbnail VARCHAR(255) NOT NULL,
      create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`;
        await sql `
    CREATE TABLE IF NOT EXISTS songs (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      discription VARCHAR(255) NOT NULL,
      thumbnail VARCHAR(255),
      audio VARCHAR(255) NOT NULL UNIQUE,
      duration FLOAT NOT NULL,
      -- album_id INTEGER REFERENCES albums(id) ON DELETE CASCADE,
      create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`;
        // -- junction table to connect songs ↔ albums
        await sql `CREATE TABLE IF NOT EXISTS album_songs (
      album_id INT REFERENCES albums(id) ON DELETE CASCADE,
      song_id INT REFERENCES songs(id) ON DELETE CASCADE,
      PRIMARY KEY (album_id, song_id)
    )`;
        console.log("Database Initialize successfully");
    }
    catch (error) {
        console.log(error.message);
    }
}
app.use('/api/v1/admin', adminRoutes);
const port = process.env.PORT || 7001;
initDB().then(() => {
    app.listen(port, () => {
        console.log(`server is running ${port}`);
    });
});
//# sourceMappingURL=index.js.map