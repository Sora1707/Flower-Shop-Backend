import { Response, NextFunction } from "express";
import { AuthRequest } from "@/types/request";
import { Role } from "@/user";

function authorize(role: string) {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        const user = req.user;

        if (!user || user.role !== role) {
            return res.status(403).json({ message: "Access denied" });
        }

        next();
    };
}

export const isAdmin = authorize(Role.Admin);
export const isUser = authorize(Role.User);
