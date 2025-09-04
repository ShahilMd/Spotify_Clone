import express from 'express'
import {uploadFile, isAuth, uploadMultiple } from './middleware.js';
import { addAlbum, addAlbums, addSong, addSongs } from './controller.js';

const router = express.Router();

router.post('/album/new' ,isAuth,uploadFile, addAlbum)
router.post('/albums/new', isAuth, uploadMultiple.array('thumbnails'),addAlbums);
router.post("/song/new" , isAuth , uploadFile , addSong)
router.post("/songs/new" , isAuth , uploadMultiple.array('audios') , addSongs)


export default router 

