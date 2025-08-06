import { Request } from "express";
import { IUserDocument } from "@/user";

import * as core from "express-serve-static-core";

export interface AuthRequest<
    P = core.ParamsDictionary,
    ResBody = any,
    ReqBody = any,
    ReqQuery = core.Query,
    Locals extends Record<string, any> = Record<string, any>
> extends Request<P, ResBody, ReqBody, ReqQuery, Locals> {
    user?: IUserDocument;
}
