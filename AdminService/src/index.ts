import express from 'express';
import dotenv from 'dotenv'
import { sql } from './config/db.js';
import adminRoutes from './route.js'
import cloudinary from 'cloudinary';


dotenv.config({
  path: './.env'
})


cloudinary.v2.config({
  cloud_name: process.env.CLOUD_NAME as string,
  api_key: process.env.CLOUD_API_KEY as string,
  api_secret: process.env.CLOUD_API_SECRET as string,
});

const app = express();
app.use(express.json())

async function  initDB() {
  try {
    await sql`
    CREATE TABLE IF NOT EXISTS albums (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL UNIQUE,
      discription VARCHAR(255) NOT NULL,
      thumbnail VARCHAR(255) NOT NULL,
      create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`;
    await sql`
    CREATE TABLE IF NOT EXISTS songs (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      discription VARCHAR(255) NOT NULL,
      thumbnail VARCHAR(255),
      audio VARCHAR(255) NOT NULL UNIQUE,
      -- album_id INTEGER REFERENCES albums(id) ON DELETE CASCADE,
      create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`;

    // -- junction table to connect songs ↔ albums
    await  sql`CREATE TABLE IF NOT EXISTS album_songs (
      album_id INT REFERENCES albums(id) ON DELETE CASCADE,
      song_id INT REFERENCES songs(id) ON DELETE CASCADE,
      PRIMARY KEY (album_id, song_id)
    )`;

    console.log("Database Initialize successfully");
  } catch (error : any) {
    console.log(error.message);
  }
}


app.use('/api/v1/admin',adminRoutes)


const port =process.env.PORT || 7001;

initDB().then(() => {
  app.listen(port, () => {
    console.log(`server is running ${port}`);
  })
})
