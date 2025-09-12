import express from 'express'
import {uploadFile, isAuth, uploadMultiple } from './middleware.js';
import {addAlbum, addAlbums, addSong, addSongs, addThumbnail, deleteAlbum, deleteSong} from './controller.js';

const router = express.Router();

router.post('/album/new' ,isAuth,uploadFile, addAlbum)
router.post('/albums/new', isAuth, uploadMultiple.array('thumbnails'),addAlbums);
router.delete('/album/:id' ,isAuth, deleteAlbum)
router.post("/song/new" , isAuth , uploadFile , addSong)
router.post("/songs/new" , isAuth , uploadMultiple.array('audios') , addSongs)
router.post('/song/:id' , isAuth , uploadFile , addThumbnail)
router.delete('/song/:id' , isAuth  , deleteSong)


export default router 

