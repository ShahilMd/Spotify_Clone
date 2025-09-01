
import TryCatch from "./TryCatch.js";
import type { AuthenticatedRequest } from "./middleware.js";
import {User} from "./model.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"


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