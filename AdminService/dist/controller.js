import getBuffer from "./config/dataUri.js";
import TryCatch from "./TryCatch.js";
import cloudinary from "cloudinary";
import { sql } from "./config/db.js";
export const addAlbum = TryCatch(async (req, res) => {
    if (req.user?.role == "admin") {
        res.status(401).json({
            message: "Unauthorized you are not admin"
        });
        return;
    }
    const { title, discription } = req.body;
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
//# sourceMappingURL=controller.js.map