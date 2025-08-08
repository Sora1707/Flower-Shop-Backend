import { Request, Response, NextFunction } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";

type AsyncFunction<P = ParamsDictionary, ResBody = any, ReqBody = any, ReqQuery = ParsedQs> = (
    req: Request<P, ResBody, ReqBody, ReqQuery>,
    res: Response,
    next: NextFunction
) => Promise<any>;

const asyncHandler = <P = ParamsDictionary, ResBody = any, ReqBody = any, ReqQuery = ParsedQs>(
    fn: AsyncFunction<P, ResBody, ReqBody, ReqQuery>
) => {
    return (req: Request<P, ResBody, ReqBody, ReqQuery>, res: Response, next: NextFunction) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};
export default asyncHandler;
