import express from 'express';
import { getAllAlbums, getAllSongs, getAllSongsByAlbum, getSingleSong } from './controller.js';
const router = express.Router();
router.get('/albums', getAllAlbums);
router.get('/album/:id', getAllSongsByAlbum);
router.get('/songs', getAllSongs);
router.get('/song/:id', getSingleSong);
export default router;
//# sourceMappingURL=route.js.map