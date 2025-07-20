import { NextFunction, Request, Response } from "express";

import ResponseHandler from "@/utils/ResponseHandler";
import { checkPayloadBeforePasswordReset, getLoginPayload } from "@/user/token";

import { AuthRequest } from "@/types/request";
import { userService } from "@/user";

function validAuthenticationHeader(req: Request) {
    return req.headers.authorization && req.headers.authorization.startsWith("Bearer ");
}

function extractTokenFromHeader(req: Request): string {
    const authorizationHeader = req.headers.authorization as string;
    if (authorizationHeader && authorizationHeader.startsWith("Bearer ")) {
        return authorizationHeader.split(" ")[1];
    }
    return "";
}

async function authenticate(req: Request, res: Response, next: NextFunction) {
    if (!validAuthenticationHeader(req)) {
        return ResponseHandler.error(res, "Not authenticated, no token provided", 401);
    }

    const token = extractTokenFromHeader(req);

    try {
        const payload = getLoginPayload(token);

        const user = await userService.findById(payload.userId, { password: 0 });

        if (!user) {
            return ResponseHandler.error(res, "Invalid token", 401);
        }

        if (checkPayloadBeforePasswordReset(payload, user)) {
            return ResponseHandler.error(
                res,
                "Token is outdated due to recent password change",
                400
            );
        }

        (req as AuthRequest).user = user;
        next();
    } catch (error) {
        ResponseHandler.error(res, "Invalid token", 401);
        next();
    }
}

export default authenticate;
