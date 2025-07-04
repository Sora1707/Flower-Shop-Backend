import { AuthRequest } from "@/types/request";
import { userService } from "@/user";
import { getLoginPayload } from "@/utils/token";
import { NextFunction, Request, Response } from "express";

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
        return res.status(401).json({ error: "Not authenticated, no token provided" });
    }

    const token = extractTokenFromHeader(req);

    try {
        const payload = getLoginPayload(token);

        const user = await userService.findById(payload.userId, { password: 0 });

        if (!user) {
            return res.status(401).json({ error: "Invalid token. User not found" });
        }
        (req as AuthRequest).user = user;
        next();
    } catch (error) {
        res.status(401).json({ error: "Not authenticated, invalid token" });
        next();
    }
}

export default authenticate;
