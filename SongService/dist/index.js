import express from "express";
import dotenv from 'dotenv';
import songRoutes from './route.js';
dotenv.config({
    path: './.env'
});
const app = express();
const port = process.env.PORT || 6000;
app.use("/api/v1", songRoutes);
app.listen(port, () => {
    console.log(`songservice is running ${port}`);
});
//# sourceMappingURL=index.js.map