import type {NextFunction, RequestHandler} from "express";

// @ts-ignore
const TryCatch = (handler:RequestHandler):(req: Request, res: Response, next: e.NextFunction) => Promise<void> => {
    return async (req:Request , res:Response , next:NextFunction) => {
        try {
            // @ts-ignore
            await  handler(req,res,next)
        } catch (error : any) {
            // @ts-ignore
            res.status(500).json({
                message:error.message
            })

        }

    }
}


export default TryCatch;