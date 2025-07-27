import { Request, Response, NextFunction, RequestHandler } from "express";

type AsyncHandlerFunction = (
    req: Request,
    res: Response,
    next: NextFunction
) => Promise<any>;

export const asyncHandler = (requestHandler: AsyncHandlerFunction): RequestHandler => {
    return (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next)).catch(next);
    };
};
