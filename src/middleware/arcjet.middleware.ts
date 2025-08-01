import { Request, Response, NextFunction } from "express";

import aj from "../config/arcjet";
import ResponseHandler from "@/utils/ResponseHandler";

const REQUESTED_TOKENS = 1;

async function arcjetMiddleware(req: Request, res: Response, next: NextFunction) {
    try {
        const decision = await aj.protect(req, { requested: REQUESTED_TOKENS });

        if (decision.isDenied()) {
            if (decision.reason.isRateLimit()) {
                ResponseHandler.error(res, "Rate limit exceeded", 429);
                return;
            } else if (decision.reason.isBot()) {
                ResponseHandler.error(res, "Bot detected", 403);
                return;
            }

            ResponseHandler.error(res, "Access denied", 403);
            return;
        }

        next();
    } catch (error) {
        console.log(`Arcjet error: ${error}`);
        next(error);
    }
}

export default arcjetMiddleware;
