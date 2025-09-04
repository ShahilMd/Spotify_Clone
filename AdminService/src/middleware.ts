import axios from 'axios';
import type {NextFunction ,Request ,Response} from 'express';
import dotenv from 'dotenv';
import multer from 'multer';


dotenv.config({
  path: './.env'
})


interface IUser{
  _id:string;
  name: string;
  email:string; 
  password:string;
  role:string;
  playlist:string[]
}

interface AuthenticatedRequest extends Request{
  user?:IUser |null
}

export const isAuth = async(req:AuthenticatedRequest , res:Response, next:NextFunction):Promise<void> => {
  try {
    
    const token = req.headers.token as string

    if(!token){
      res.status(403).json({
        message:"Please Login"
      })
      return;
    }

    const {data} = await axios.get(`${process.env.USER_URL}/api/v1/user/profile`,{
      headers: {
        token
      }
    })

    req.user = data.user;
    next();

  } catch (error) {
    res.status(403).json({
      message:"Please Login"
    })
    return;
  }
}

//multer setup
const storage = multer.memoryStorage();

const uploadFile = multer({storage}).single('file');

const uploadMultiple = multer({ storage: multer.memoryStorage() });

export {  uploadFile , uploadMultiple};