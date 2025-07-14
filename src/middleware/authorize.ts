import { NextFunction, Response } from "express";

import ResponseHandler from "@/utils/ResponseHandler";

import { AuthRequest } from "@/types/request";
import { Role } from "@/user";

function authorize(role: string) {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        const user = req.user;

        if (!user || (user.role !== Role.Admin && user.role !== role)) {
            ResponseHandler.error(res, "Access denied", 403);
            return;
        }

        next();
    };
}

export const isAdmin = authorize(Role.Admin);
export const isUser = authorize(Role.User);
