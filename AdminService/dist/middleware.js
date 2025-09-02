import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config({
    path: './.env'
});
export const isAuth = async (req, res, next) => {
    try {
        const token = req.headers.token;
        if (!token) {
            res.status(403).json({
                message: "Please Login"
            });
            return;
        }
        const { data } = await axios.get(`${process.env.USER_URL}/api/v1/user/profile`, {
            headers: {
                token
            }
        });
        req.user = data;
        next();
    }
    catch (error) {
        res.status(403).json({
            message: "Please Login"
        });
        return;
    }
};
//# sourceMappingURL=middleware.js.map