import { sql } from "./config/db.js";
import TryCatch from "./TryCatch.js";
export const getAllAlbums = TryCatch(async (req, res) => {
    const albums = await sql `
  SELECT * FROM albums
  `;
    res.json(albums);
});
export const getAllSongs = TryCatch(async (req, res) => {
    const songs = await sql `SELECT * FROM songs`;
    res.json(songs);
});
export const getAllSongsByAlbum = TryCatch(async (req, res) => {
    const { id } = req.params;
    // Validate album ID
    if (!id || isNaN(parseInt(id))) {
        return res.status(400).json({
            message: "Invalid album ID provided"
        });
    }
    const albumId = parseInt(id);
    try {
        // Check if album exists and get album details
        const album = await sql `
      SELECT id, title, discription, thumbnail, create_at 
      FROM albums 
      WHERE id = ${albumId}
    `;
        if (album.length === 0) {
            return res.status(404).json({
                message: `Album with ID ${albumId} not found`
            });
        }
        // Fetch all songs for the album with album information
        const songsData = await sql `
      SELECT 
        s.id,
        s.title,
        s.discription,
        s.thumbnail,
        s.audio,
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
        // Format the response
        const response = {
            album: {
                id: album[0]?.id,
                title: album[0]?.title,
                description: album[0]?.discription,
                thumbnail: album[0]?.thumbnail,
                created_at: album[0]?.create_at,
                total_songs: songsData.length
            },
            songs: songsData.map(song => ({
                id: song.id,
                title: song.title,
                description: song.discription,
                thumbnail: song.thumbnail,
                audio: song.audio,
                created_at: song.create_at
            }))
        };
        res.status(200).json({
            success: true,
            message: `Found ${songsData.length} songs in album "${album[0]?.title}"`,
            data: response
        });
    }
    catch (error) {
        console.error('Error fetching songs by album:', error);
        res.status(500).json({
            success: false,
            message: "Internal server error while fetching songs"
        });
    }
});
export const getSingleSong = TryCatch(async (req, res) => {
    const { id } = req.params;
    const song = await sql `
  SELECT * FROM songs WHERE id = ${id}
  `;
    res.json(song);
});
//# sourceMappingURL=controller.js.map