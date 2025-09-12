
import TryCatch from "./TryCatch.js";
import type { AuthenticatedRequest } from "./middleware.js";
import {User} from "./model.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import axios from "axios";


export const RegisterUser = TryCatch(async (req,res) => {
    const {name, email, password} = req.body;
    let user = await User.findOne({email})

    if(user){
        return res.status(400).json({message:"User already exists"})
    }

    const hashPassword = await bcrypt.hash(password, 12);
    user = await User.create({
        name,
        email,
        password:hashPassword,
    });

    const token = jwt.sign({_id:user._id} , process.env.JWT_SEC as string, {expiresIn: "7d"});

    return res.status(201).json({
        message:"User successfully registered",
        user,
        token,
    })

})

export const LoginUser = TryCatch(async (req,res) => {
    const {email , password} = req.body;

    const user = await  User.findOne({email})

    if(!user){
        return res.status(400).json({message:"User Not Found"})
    }

    const  isMatch = await  bcrypt.compare(password,user.password)
    if(!isMatch){
        return res.status(401).json({message:"Invalid Email or password"})
    }

    const token = jwt.sign({_id:user._id} , process.env.JWT_SEC as string, {expiresIn: "7d"});

    return res.status(200).json({
        message:"Login Successfully",
        user,
        token,
    })
})

export const MyProfile = TryCatch(async(req : AuthenticatedRequest,res) => {
    const user = req.user;

    return res.status(202).json({
        user
    })


})


export const registerUser = TryCatch(async (req, res) => {
    const { name, email, password } = req.body;
    let user = await User.findOne({ email });

    if (user) {
        res.status(400).json({
            message: "User Already exists",
        });

        return;
    }

    const hashPassword = await bcrypt.hash(password, 10);

    user = await User.create({
        name,
        email,
        password: hashPassword,
    });

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SEC as string, {
        expiresIn: "7d",
    });

    res.status(201).json({
        message: "User Registered",
        user,
        token,
    });
});

export const loginUser = TryCatch(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
        res.status(404).json({
            message: "User not exists",
        });
        return;
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        res.status(400).json({
            message: "Invalid Password",
        });
        return;
    }

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SEC as string, {
        expiresIn: "7d",
    });

    res.status(200).json({
        message: "Logged IN",
        user,
        token,
    });
});

export const myProfile = TryCatch(async (req: AuthenticatedRequest, res) => {
    const user = req.user;

    res.json(user);
});

export const addToPlaylist = TryCatch(
    async (req: AuthenticatedRequest, res) => {
        const userId = req.user?._id;
        const id = req.params.id as string;

        const user = await User.findById(userId);

        if (!user) {
            res.status(404).json({
                message: "NO user with this id",
            });
            return;
        }

        if (user?.playlist.includes(id)) {
            const index = user.playlist.indexOf(id);

            user.playlist.splice(index, 1);

            await user.save();

            res.json({
                message: " Removed from playlist",
            });
            return;
        }

        user.playlist.push(id);

        await user.save();

        res.json({
            message: "Added to PlayList",
        });
    }
);

export const removeFromPlaylist = TryCatch(async (req:AuthenticatedRequest , res) => {
    const userId = req.user?._id;
    const id = req.params.id as string;

    const user = await User.findById(userId);

    if (!user) {
        res.status(404).json({
            message: "NO user with this id",
        });
        return;
    }

    if (user?.playlist.includes(id)) {
        const index = user.playlist.indexOf(id);

        user.playlist.splice(index, 1);

        await user.save();

        res.json({
            message: " Removed from playlist",
        });
        return;
    }
})

export const myPlaylist = TryCatch(async (req: AuthenticatedRequest, res) => {
    const userId = req.user?._id;

    const user = await User.findById(userId);

    if (!user) {
        res.status(404).json({
            message: "NO user with this id",
        });
        return;
    }

    const playlist = user?.playlist;

    if (!playlist || playlist.length === 0) {
        return res.json([]);
    }

    try {
        const songPromises = playlist.map((songId) =>
            axios.get(`http://localhost:5001/api/v1/song/${songId}`)
        );

        const songResponses = await Promise.all(songPromises);
        const songs = songResponses.map((response) => response.data[0]);

        res.json(songs);
    } catch (error) {
        console.error("Error fetching songs from playlist:", error);
        res.status(500).json({ message: "Error fetching playlist details" });
    }
});
