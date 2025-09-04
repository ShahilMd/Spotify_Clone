import type { NextFunction, Request, Response } from 'express';
import multer from 'multer';
interface IUser {
    _id: string;
    name: string;
    email: string;
    password: string;
    role: string;
    playlist: string[];
}
interface AuthenticatedRequest extends Request {
    user?: IUser | null;
}
export declare const isAuth: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
declare const uploadFile: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
declare const uploadMultiple: multer.Multer;
export { uploadFile, uploadMultiple };
//# sourceMappingURL=middleware.d.ts.map