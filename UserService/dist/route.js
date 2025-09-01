import express from "express";
import { LoginUser, MyProfile, RegisterUser } from "./controller.js";
import { isAuth } from "./middleware.js";
const router = express.Router();
router.post('/user/register', RegisterUser);
router.post('/user/login', LoginUser);
router.get('/user/profile', isAuth, MyProfile);
export default router;
//# sourceMappingURL=route.js.map