import express from "express";
import { LoginUser, MyProfile, RegisterUser, addToPlaylist, myPlaylist, removeFromPlaylist } from "./controller.js";
import { isAuth } from "./middleware.js";
const router = express.Router();
router.post('/user/register', RegisterUser);
router.post('/user/login', LoginUser);
router.get('/user/profile', isAuth, MyProfile);
router.post("/song/:id", isAuth, addToPlaylist);
router.delete("/song/remove/:id", isAuth, removeFromPlaylist);
router.get('/user/myplaylist', isAuth, myPlaylist);
export default router;
//# sourceMappingURL=route.js.map