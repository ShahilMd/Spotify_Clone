import express from "express";
import { LoginUser, MyProfile, RegisterUser, addToPlaylist, myPlaylist } from "./controller.js";
import { isAuth } from "./middleware.js";
const router = express.Router();
router.post('/user/register', RegisterUser);
router.post('/user/login', LoginUser);
router.get('/user/profile', isAuth, MyProfile);
router.post("/song/:id", isAuth, addToPlaylist);
router.get('/user/myplaylist', isAuth, myPlaylist);
export default router;
//# sourceMappingURL=route.js.map