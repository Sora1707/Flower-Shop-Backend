import { Router } from "express";

import adminUserController from "./user.controller";

import asyncHandler from "@/middleware/asyncHandler.middelware";
import { validateBody, validateQuery } from "@/middleware/validate.middelware";
import { adminUserRequestQuery, adminUserUpdateRoleValidation } from "./user.validation";

const router = Router();

router.get("/:userId", asyncHandler(adminUserController.getUserById));

router.get("/", validateQuery(adminUserRequestQuery), asyncHandler(adminUserController.getUsers));

router.patch(
    "/:userId/role",
    validateBody(adminUserUpdateRoleValidation),
    asyncHandler(adminUserController.updateUserRole)
);

router.delete("/:userId", asyncHandler(adminUserController.deleteUser));

// TODO Change user's status: ACTIVE, SUSPENDED, BANNED

export default router;
