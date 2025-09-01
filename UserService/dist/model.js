import mongoose, { Document, Schema } from "mongoose";
const schema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        default: "user",
    },
    playlist: [{
            type: String,
        }]
}, {
    timestamps: true
});
export const User = mongoose.model("User", schema);
//# sourceMappingURL=model.js.map