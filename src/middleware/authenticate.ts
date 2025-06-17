import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { userService } from "@/user";
import { AuthRequest } from "@/types/request";

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
        return res.status(401).json({ error: "Not authorized, no token provided" });
    }

    const token = extractTokenFromHeader(req);
    const decodeKey = process.env.JWT_SECRET as string;

    try {
        const decodedData = jwt.verify(token, decodeKey) as {
            userId: string;
        };

        const user = await userService.findById(decodedData.userId, { password: 0 });

        if (!user) {
            return res.status(401).json({ error: "Invalid token. User not found" });
        }
        (req as AuthRequest).user = user;
        next();
    } catch (error) {
        res.status(401).json({ error: "Not authorized, invalid token" });
        next();
    }
}

export default authenticate;
