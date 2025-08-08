import { NextFunction, Response } from "express";

import ResponseHandler from "@/utils/ResponseHandler";

import { AuthRequest } from "@/types/request";
import { Role } from "@/user";

function authorize(authRoles: Role | Role[]) {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        const user = req.user;

        if (!user) {
            ResponseHandler.error(res, "Unauthorized", 401);
            return;
        }

        if (user.role === Role.SuperAdmin || user.role === Role.Admin) {
            next();
            return;
        }

        authRoles = Array.isArray(authRoles) ? authRoles : [authRoles];

        if (!authRoles.includes(user.role)) {
            ResponseHandler.error(res, "Access Denied", 403);
            return;
        }

        next();
    };
}

export const isAdmin = authorize(Role.Admin);
export const isUser = authorize(Role.User);
