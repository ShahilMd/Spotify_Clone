import mongoose , {Document , Schema} from "mongoose";

export interface IUser extends Document{
    name : string;
    email : string;
    password: string;
    role : string;
    playlist: string[];
}

const schema:Schema<IUser> = new Schema({
    name : {
        type: String,
        required: true,
        trim: true,
    },
    email : {
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
    playlist:[ {
        type: String,
    }]
},{
    timestamps: true
})

export const User = mongoose.model<IUser>("User", schema);