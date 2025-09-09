import getBuffer from "./config/dataUri.js";
import TryCatch from "./TryCatch.js";
import cloudinary from "cloudinary";
import { sql } from "./config/db.js";
export const addAlbum = TryCatch(async (req, res) => {
    if (req.user?.role !== "admin") {
        res.status(401).json({
            message: "Unauthorized you are not admin"
        });
        return;
    }
    const { title, discription } = req.body;
    if (!title || !discription) {
        res.status(400).json({
            message: "Please provide title and discription"
        });
        return;
    }
    const isExist = await sql `
    SELECT * FROM albums WHERE title = ${title}
    `;
    if (isExist.length > 0) {
        res.status(400).json({
            message: "Album already exists"
        });
        return;
    }
    const file = req.file;
    if (!file) {
        res.status(400).json({
            message: "Please upload a file"
        });
        return;
    }
    const fileBuffer = getBuffer(file);
    if (!fileBuffer || !fileBuffer.content) {
        res.status(500).json({
            message: "Error uploading file"
        });
        return;
    }
    const cloud = await cloudinary.v2.uploader.upload(fileBuffer.content, {
        folder: "albums"
    });
    const result = await sql `
    INSERT INTO albums(title,discription,thumbnail) VALUES(${title},${discription},${cloud.secure_url}) RETURNING *
    `;
    res.json({
        message: "Album created successfully",
        album: result[0]
    });
});
export const addAlbums = TryCatch(async (req, res) => {
    if (req.user?.role !== 'admin') {
        res.status(401).json({
            message: "Unauthorized acess"
        });
        return;
    }
    let albums = req.body.albums;
    const thumbnails = req.files;
    if (albums) {
        if (typeof albums === 'string') {
            albums = JSON.parse(albums);
        }
    }
    if (!Array.isArray(albums) || albums.length === 0) {
        res.status(400).json({ message: "Please provide an array of albums" });
        return;
    }
    if (!Array.isArray(thumbnails) || thumbnails.length !== albums.length) {
        res.status(400).json({ message: "Number of thumbnails must match number of albums" });
        return;
    }
    const createAlbums = [];
    const errors = [];
    for (let i = 0; i < albums.length; i++) {
        const { title, discription } = albums[i];
        const file = thumbnails[i];
        if (!title || !discription) {
            errors.push("Please provide title, discription, and thumbnail");
            continue;
        }
        const isExist = await sql `
    SELECT * FROM albums WHERE title = ${title}
    `;
        if (isExist.length > 0) {
            errors.push(`Album ${title} already exists`);
            continue;
        }
        const fileBuffer = getBuffer(file);
        if (!fileBuffer || !fileBuffer.content) {
            errors.push(`Error uploading thumbnail for album ${title}`);
            continue;
        }
        const cloud = await cloudinary.v2.uploader.upload(fileBuffer.content, {
            folder: 'albums'
        });
        const result = await sql `
    INSERT INTO albums(title , discription ,thumbnail) VALUES (${title},${discription} , ${cloud.secure_url} )RETURNING *
    `;
        createAlbums.push(result[0]);
    }
    res.json({
        message: 'Albums Added',
        createAlbums,
        errors
    });
});
export const addSong = TryCatch(async (req, res) => {
    if (req.user?.role !== 'admin') {
        res.status(401).json({
            message: "Unauthorized acess"
        });
        return;
    }
    const { title, discription, album_id } = req.body;
    const isAlbum = await sql `
  SELECT * FROM albums WHERE id = ${album_id}
  `;
    if (isAlbum.length === 0) {
        res.status(404).json({
            message: `No album found with id ${album_id}`
        });
        return;
    }
    const file = req.file;
    if (!file) {
        res.status(400).json({
            message: "Please upload a file"
        });
        return;
    }
    const fileBuffer = getBuffer(file);
    if (!fileBuffer || !fileBuffer.content) {
        res.status(500).json({
            message: "Failed to generate file buffer"
        });
        return;
    }
    const cloud = await cloudinary.v2.uploader.upload(fileBuffer.content, {
        folder: "songs",
        resource_type: "video"
    });
    let song = await sql `
    SELECT * FROM songs WHERE title = ${title} OR audio = ${cloud.secure_url}
  `;
    if (song.length === 0) {
        // Insert new song
        const inserted = await sql `
      INSERT INTO songs (title, discription, audio) 
      VALUES (${title}, ${discription}, ${cloud.secure_url})
      RETURNING *
    `;
        song = inserted;
    }
    await sql `
  INSERT INTO album_songs (album_id, song_id)
  VALUES (${album_id}, ${song?.[0]?.id})
  ON CONFLICT DO NOTHING
  `;
    res.json({
        message: "Song added",
        song: song[0]
    });
});
export const addSongs = TryCatch(async (req, res) => {
    // Authorization check
    if (req.user?.role !== 'admin') {
        return res.status(401).json({
            message: "Unauthorized access"
        });
    }
    let songs = req.body.songs;
    const audios = req.files;
    // Input validation
    if (!songs) {
        return res.status(400).json({
            message: 'Please provide array of songs'
        });
    }
    // Parse songs if it's a string
    if (typeof songs === 'string') {
        try {
            songs = JSON.parse(songs);
        }
        catch (error) {
            return res.status(400).json({
                message: 'Invalid JSON format for songs'
            });
        }
    }
    if (!Array.isArray(songs) || songs.length === 0) {
        return res.status(400).json({
            message: "Please provide a non-empty array of songs"
        });
    }
    if (!Array.isArray(audios) || audios.length !== songs.length) {
        return res.status(400).json({
            message: "Number of audio files must match number of songs"
        });
    }
    const processedSongs = [];
    const errors = [];
    const skippedDuplicates = [];
    // Pre-validate all album IDs to avoid processing files unnecessarily
    const albumIds = [...new Set(songs.map(song => song.album_id))];
    const existingAlbums = await sql `
    SELECT id FROM albums WHERE id = ANY(${albumIds})
  `;
    const validAlbumIds = new Set(existingAlbums.map(album => album.id));
    for (let i = 0; i < songs.length; i++) {
        try {
            const { title, discription, album_id } = songs[i];
            const audio = audios[i];
            // Validate required fields
            if (!title?.trim() || !discription?.trim() || !album_id) {
                errors.push(`Song ${i + 1}: Missing required fields (title, description, album_id)`);
                continue;
            }
            // Check if album exists (using pre-fetched data)
            if (!validAlbumIds.has(parseInt(album_id))) {
                errors.push(`Song ${i + 1}: No album found with id ${album_id}`);
                continue;
            }
            // Validate audio file
            if (!audio || !audio.buffer) {
                errors.push(`Song ${i + 1}: Invalid audio file for "${title}"`);
                continue;
            }
            const fileBuffer = getBuffer(audio);
            if (!fileBuffer || !fileBuffer.content) {
                errors.push(`Song ${i + 1}: Error processing audio file for "${title}"`);
                continue;
            }
            // Check if song already exists in this album
            const existingRelation = await sql `
        SELECT s.id, s.title, s.audio 
        FROM songs s
        INNER JOIN album_songs als ON s.id = als.song_id
        WHERE als.album_id = ${album_id} 
        AND (LOWER(s.title) = LOWER(${title.trim()}))
      `;
            if (existingRelation.length > 0) {
                skippedDuplicates.push({
                    title: title.trim(),
                    album_id,
                    reason: 'Song already exists in this album'
                });
                continue;
            }
            // Upload to cloudinary
            const cloudResult = await cloudinary.v2.uploader.upload(fileBuffer.content, {
                folder: 'songs',
                resource_type: 'video',
            });
            let songRecord;
            // Check if song with same title OR audio URL already exists
            const existingSong = await sql `
        SELECT * FROM songs 
        WHERE LOWER(title) = LOWER(${title.trim()}) 
        OR audio = ${cloudResult.secure_url}
      `;
            if (existingSong.length > 0) {
                // Song exists, use existing record
                songRecord = existingSong[0];
                // Check if this song is already in the target album
                const albumSongExists = await sql `
          SELECT 1 FROM album_songs 
          WHERE album_id = ${album_id} AND song_id = ${songRecord?.id}
        `;
                if (albumSongExists.length > 0) {
                    skippedDuplicates.push({
                        title: title.trim(),
                        album_id,
                        reason: 'Song already linked to this album'
                    });
                    continue;
                }
            }
            else {
                // Create new song record
                const newSong = await sql `
          INSERT INTO songs (title, discription, audio) 
          VALUES (${title.trim()}, ${discription.trim()}, ${cloudResult.secure_url})
          RETURNING *
        `;
                songRecord = newSong[0];
            }
            // Create album-song relationship
            await sql `
        INSERT INTO album_songs (album_id, song_id)
        VALUES (${album_id}, ${songRecord?.id})
        ON CONFLICT (album_id, song_id) DO NOTHING
      `;
            processedSongs.push({
                id: songRecord?.id,
                title: songRecord?.title,
                discription: songRecord?.discription,
                audio: songRecord?.audio,
                album_id: parseInt(album_id),
                isNew: existingSong.length === 0
            });
        }
        catch (error) {
            console.error(`Error processing song ${i + 1}:`, error);
            errors.push(`Song ${i + 1}: Unexpected error occurred`);
        }
    }
    // Prepare response
    const response = {
        message: "Songs processing completed",
        summary: {
            total: songs.length,
            processed: processedSongs.length,
            errors: errors.length,
            skipped: skippedDuplicates.length
        },
        processedSongs
    };
    if (errors.length > 0) {
        response.errors = errors;
    }
    if (skippedDuplicates.length > 0) {
        response.skippedDuplicates = skippedDuplicates;
    }
    // Set appropriate status code
    const statusCode = processedSongs.length > 0 ? 200 :
        errors.length > 0 ? 207 : // Multi-status for partial success
            400;
    res.status(statusCode).json(response);
});
export const addThumbnail = TryCatch(async (req, res) => {
    if (req.user?.role !== 'admin') {
        res.status(401).json({
            message: "Unauthorized acess"
        });
        return;
    }
    let id = req.params.id;
    const file = req.file;
    if (!id || !file) {
        res.status(400).json({
            message: "Please provide song_id and file"
        });
        return;
    }
    const isExist = await sql `
  SELECT * FROM songs WHERE id = ${id}
  `;
    if (isExist.length === 0) {
        res.status(404).json({
            message: `No song found with id ${id}`
        });
        return;
    }
    const fileBuffer = getBuffer(file);
    if (!fileBuffer || !fileBuffer.content) {
        res.status(500).json({
            message: "Failed to generate file buffer"
        });
        return;
    }
    const cloud = await cloudinary.v2.uploader.upload(fileBuffer.content);
    const result = await sql `
  UPDATE songs SET thumbnail = ${cloud.secure_url} WHERE id = ${id} RETURNING *
  `;
    res.json({
        message: "Thumbnail updated",
        song: result[0]
    });
});
export const deleteAlbum = TryCatch(async (req, res) => {
    if (req.user?.role !== 'admin') {
        res.status(401).json({
            message: "Unauthorized acess"
        });
        return;
    }
    let { id } = req.params;
    const isExist = await sql `SELECT * FROM albums WHERE id = ${id}`;
    if (isExist.length === 0) {
        res.status(400).json({
            message: `No album found with id ${id}`
        });
        return;
    }
    await sql `DELETE FROM albums WHERE id = ${id}`;
    res.json({
        message: "Album deleted successfully"
    });
});
//# sourceMappingURL=controller.js.map