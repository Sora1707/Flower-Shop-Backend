import { Router } from "express";

import adminUserController from "./user.controller";

import asyncHandler from "@/middleware/asyncHandler.middelware";
import { validateBody } from "@/middleware/validate.middelware";
import { adminUserUpdateRoleValidation } from "./user.validation";

const router = Router();

router.get("/", asyncHandler(adminUserController.getUsers));

router.get("/:id", asyncHandler(adminUserController.getUserById));

router.patch(
    "/:id/role",
    validateBody(adminUserUpdateRoleValidation),
    asyncHandler(adminUserController.updateUserRole)
);

router.delete("/:id", asyncHandler(adminUserController.deleteUser));

export default router;
