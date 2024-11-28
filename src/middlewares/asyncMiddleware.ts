import { Request, Response, NextFunction } from "express";

export const asyncMiddleware = <T>(fn: (req: Request, res: Response, next: NextFunction) => Promise<T>) => 
    (req: Request, res: Response, next: NextFunction) => {
        fn(req, res, next).catch(next);
    };