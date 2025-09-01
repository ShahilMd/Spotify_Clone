import type { RequestHandler } from "express";
declare const TryCatch: (handler: RequestHandler) => (req: Request, res: Response, next: e.NextFunction) => Promise<void>;
export default TryCatch;
//# sourceMappingURL=TryCatch.d.ts.map