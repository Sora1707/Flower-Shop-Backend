import { NextFunction, Request, Response } from "express";

import { Role, userService } from "@/user";

import ResponseHandler from "@/utils/ResponseHandler";
import { AdminUserUpdateRoleValidation } from "./user.validation";
import { AuthRequest } from "@/types/request";

class AdminUserController {
    async getUsers(req: Request, res: Response, next: NextFunction) {
        const { page, limit, ...filter } = req.query;

        const paginateOptions = {
            page: page ? parseInt(page as string, 10) : 1,
            limit: limit ? parseInt(limit as string, 10) : 10,
        };

        const paginateResult = await userService.paginate(filter, paginateOptions);

        ResponseHandler.success(res, paginateResult);
    }

    async getUserById(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;

        const user = await userService.findById(id);

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        ResponseHandler.success(res, user);
    }

    async updateUserRole(
        req: AuthRequest<{ id: string }, {}, AdminUserUpdateRoleValidation>,
        res: Response,
        next: NextFunction
    ) {
        const user = req.user;
        const { id } = req.params;
        const role = req.body.role as Role;

        if (!user) {
            return;
        }

        if (user.id == id) {
            return ResponseHandler.error(res, "You can't update your own role", 400);
        }

        const targetUser = await userService.findById(id);

        if (!targetUser) {
            return ResponseHandler.error(res, "User not found.", 404);
        }

        if (user.role == Role.Admin) {
            if (targetUser.role == Role.SuperAdmin || targetUser.role == Role.Admin)
                return ResponseHandler.error(res, "You can't update other admin's role", 403);

            if (targetUser.role == Role.User)
                if (role == Role.SuperAdmin || role == Role.Admin)
                    return ResponseHandler.error(
                        res,
                        "You can't update other user's role to admin",
                        403
                    );
        }

        targetUser.role = role;
        const updatedUser = await targetUser.save();

        ResponseHandler.success(res, updatedUser, "User updated");
    }

    async deleteUser(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;
        const deleteUser = await userService.deleteById(id);

        if (!deleteUser) {
            return res.status(404).json({ message: "User not found." });
        }

        ResponseHandler.success(res, null, "User deleted successfully");
    }
}

export default new AdminUserController();
