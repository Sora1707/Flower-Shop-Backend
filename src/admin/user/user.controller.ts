import { NextFunction, Request, Response } from "express";

import { Role, userService } from "@/user";

import ResponseHandler from "@/utils/ResponseHandler";
import { AdminUserRequestQuery, AdminUserUpdateRoleValidation } from "./user.validation";
import { AuthRequest } from "@/types/request";
import { extractUserOptionsFromRequest } from "./util";

class AdminUserController {
    // [GET] /admin/user
    async getUsers(
        req: Request<{}, {}, {}, AdminUserRequestQuery>,
        res: Response,
        next: NextFunction
    ) {
        const { filters, paginateOptions } = extractUserOptionsFromRequest(req.query);
        console.log(filters, paginateOptions);

        const paginateResult = await userService.paginate(filters, paginateOptions);

        ResponseHandler.success(res, paginateResult);
    }

    // [GET] /admin/user/:userId
    async getUserById(req: Request, res: Response, next: NextFunction) {
        const { userId } = req.params;

        const user = await userService.findById(userId);

        if (!user) return ResponseHandler.error(res, "User not found.", 404);

        ResponseHandler.success(res, user);
    }

    // [PATCH] /admin/user/:userId/role
    async updateUserRole(
        req: AuthRequest<{ userId: string }, {}, AdminUserUpdateRoleValidation>,
        res: Response,
        next: NextFunction
    ) {
        const user = req.user;
        const userId = req.params.userId;
        const role = req.body.role as Role;

        if (!user) return;

        if (user.id == userId)
            return ResponseHandler.error(res, "You can't update your own role", 400);

        const targetUser = await userService.findById(userId);

        if (!targetUser) return ResponseHandler.error(res, "User not found.", 404);

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

        ResponseHandler.success(res, updatedUser, "User role updated");
    }

    // [DELETE] /admin/user/:userId
    async deleteUser(req: AuthRequest, res: Response, next: NextFunction) {
        const user = req.user;
        const userId = req.params.userId;

        if (!user) return;

        if (user.id == userId)
            return ResponseHandler.error(res, "You can't delete your own account", 400);

        const targetUser = await userService.findById(userId);

        if (!targetUser) return ResponseHandler.error(res, "User not found.", 404);

        if (user.role != Role.SuperAdmin)
            return ResponseHandler.error(res, "Only Super Admin can delete user account", 403);

        if (targetUser.role == Role.SuperAdmin)
            return ResponseHandler.error(res, "You can't delete Super Admin account", 403);

        const deleteUser = await userService.deleteById(userId);

        ResponseHandler.success(res, deleteUser, "User deleted successfully");
    }
}

export default new AdminUserController();
