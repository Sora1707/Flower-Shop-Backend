import { Router } from "express";

import adminUserController from "./user.controller";

import asyncHandler from "@/middleware/asyncHandler.middelware";
import { validateBody } from "@/middleware/validate.middelware";
import { adminUserUpdateRoleValidation } from "./user.validation";

const router = Router();

router.get("/:id", asyncHandler(adminUserController.getUserById));

router.get("/", asyncHandler(adminUserController.getUsers));

router.patch(
    "/:id/role",
    validateBody(adminUserUpdateRoleValidation),
    asyncHandler(adminUserController.updateUserRole)
);

router.delete("/:id", asyncHandler(adminUserController.deleteUser));

// TODO Change user's status: ACTIVE, SUSPENDED, BANNED

export default router;
