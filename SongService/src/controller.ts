import { sql } from "./config/db.js";
import { redisClient } from "./index.js";
import TryCatch from "./TryCatch.js";

export const getAllAlbums =TryCatch(async(req , res) => {
  let albums;
  const cache_Expiry = 3600;
  

  if(redisClient.isReady){
    albums = await redisClient.get('albums');
  }

  if(albums){
    console.log("from redis");
    
    res.json(JSON.parse(albums));
    return;
  }else{
    console.log("from db");
    
    albums = await sql`SELECT * FROM albums`;
    await redisClient.set('albums' , JSON.stringify(albums) , {EX : cache_Expiry});

    res.json(albums);
    return;
  }




});

export const getAllSongs = TryCatch(async(req , res) => {
  let songs;
  const cache_Expiry = 3600;

  if(redisClient.isReady){
    songs = await redisClient.get('songs');
  }

  if(songs){
    console.log('from redis');
    res.json(JSON.parse(songs));
    return;
    
  }else{
    console.log('from db');
    songs = await sql`SELECT * FROM songs`;
    await redisClient.set('songs' , JSON.stringify(songs) , {EX : cache_Expiry});
    
    res.json(songs);
    return;
  }
});
export const getAllSongsByAlbum = TryCatch(async (req, res) => {
    const { id } = req.params;
    const cache_Expiry = 3600;
    let album;
    let songsData;

    if (!id || isNaN(parseInt(id))) {
        return res.status(400).json({
            message: "Invalid album ID provided",
        });
    }

    const albumId = parseInt(id);

    if (redisClient.isReady) {
        const cachedAlbum = await redisClient.get(`album:${albumId}`);
        if (cachedAlbum) {
            album = JSON.parse(cachedAlbum)
        }
    }

    if (!album) {
        album = await sql`
            SELECT id, title, discription, thumbnail, create_at
            FROM albums
            WHERE id = ${albumId}`;

        if (album.length === 0) {
            return res.status(404).json({
                message: `Album with ID ${albumId} not found`,
            });
        }
        if (redisClient.isReady) {
            await redisClient.set(`album:${albumId}`, JSON.stringify(album), {
                EX: cache_Expiry,
            });
        }
    }

    if (redisClient.isReady) {
        const cachedSongs = await redisClient.get(`songs:${albumId}`);
        if (cachedSongs) {
            songsData = JSON.parse(cachedSongs)
        }
    }

    if (!songsData) {
        songsData = await sql`
      SELECT
        s.id,
        s.title,
        s.discription,
        s.thumbnail,
        s.audio,
        s.duration,
        s.create_at,
        a.id as album_id,
        a.title as album_title,
        a.discription as album_discription,
        a.thumbnail as album_thumbnail
      FROM songs s
      INNER JOIN album_songs als ON s.id = als.song_id
      INNER JOIN albums a ON als.album_id = a.id
      WHERE a.id = ${albumId}
      ORDER BY s.create_at ASC
    `;
        if (redisClient.isReady) {
            await redisClient.set(`songs:${albumId}`, JSON.stringify(songsData), {
                EX: cache_Expiry,
            });
        }
    }

    try {
        if (!album || album.length === 0 || !songsData) {
            return res.status(404).json({
                message: "Album or songs not found."
            })
        }

        const response = {
            album: {
                id: album[0]?.id,
                title: album[0]?.title,
                discription: album[0]?.discription,
                thumbnail: album[0]?.thumbnail,
                created_at: album[0]?.create_at,
                total_songs: songsData.length,
            },
            songs: songsData.map((song) => ({
                id: song.id,
                title: song.title,
                discription: song.discription,
                thumbnail: song.thumbnail,
                audio: song.audio,
                duration: song.duration,
                created_at: song.create_at,
            })),
        };

        res.status(200).json({
            success: true,
            message: `Found ${songsData.length} songs in album "${album[0]?.title}"`,
            ...response,
        });
    } catch (error) {
        console.error("Error fetching songs by album:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error while fetching songs",
        });
    }
});




export const getSingleSong = TryCatch(async (req, res) => {
  const { id } = req.params;
  let song; 

  song = await sql`
  SELECT * FROM songs WHERE id = ${id}
  `;
  if(song.length === 0){
    return res.status(404).json({
      message:`No song found with id ${id}`
    })
  }

  res.json(song);
  return;
});
