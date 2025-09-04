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
    if (isExist) {
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
        folder: "Albums"
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
    const result = await sql `
  INSERT INTO songs (title , discription , audio, album_id) VALUES (${title} ,${discription} , ${cloud.secure_url} , ${album_id})
  `;
    res.json({
        message: "Song added"
    });
});
export const addSongs = TryCatch(async (req, res) => {
    if (req.user?.role !== 'admin') {
        res.status(401).json({
            message: "Unauthorized acess"
        });
        return;
    }
    let songs = req.body.songs;
    const audios = req.files;
    if (!songs) {
        res.status(400).json({
            message: 'Please provide array of songs'
        });
    }
    if (songs || typeof songs === 'string') {
        songs = JSON.parse(songs);
    }
    if (!Array.isArray(songs) || songs.length === 0) {
        res.status(400).json({ message: "Please provide an array of songs" });
        return;
    }
    if (!Array.isArray(audios) || audios.length !== songs.length) {
        res.status(400).json({ message: "Number of audio files must match number of songs" });
        return;
    }
    const createSongs = [];
    const errors = [];
    for (let i = 0; i < songs.length; i++) {
        const { title, discription, album_id } = songs[i];
        const audio = audios[i];
        if (!title || !discription || !album_id) {
            errors.push("Please provide title discription and album_id");
            continue;
        }
        const isAlbum = await sql `
      SELECT * FROM albums WHERE id = ${album_id}
      `;
        if (isAlbum.length === 0) {
            res.status(404).json({
                message: `No album found with id ${album_id}`
            });
            return;
        }
        const fileBuffer = getBuffer(audio);
        if (!fileBuffer || !fileBuffer.content) {
            errors.push(`Error uploading audio for album ${title}`);
            ;
            continue;
        }
        const cloud = await cloudinary.v2.uploader.upload(fileBuffer.content, {
            folder: 'songs',
            resource_type: 'video'
        });
        const result = await sql `INSERT INTO songs(title , discription , audio , album_id ) VALUES (${title} , ${discription} , ${cloud.secure_url}, ${album_id}) RETURNING *`;
        createSongs.push(result[0]);
    }
    res.json({
        message: "Songs processed",
        createSongs,
        errors
    });
});
//# sourceMappingURL=controller.js.map