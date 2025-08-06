import { Router } from "express";

import AuthController from "./auth.controller";
import {
    loginValidation,
    registerValidation,
    requestPasswordResetValidation,
    resetPasswordValidation,
    changePasswordValidaton,
} from "./auth.validation";

import asyncHandler from "@/middleware/asyncHandler.middelware";
import authenticate from "@/middleware/authenticate.middelware";
import { validateBody } from "@/middleware/validate.middelware";

const router = Router();

router.post("/login", validateBody(loginValidation), asyncHandler(AuthController.login));

router.post("/register", validateBody(registerValidation), asyncHandler(AuthController.register));

router.post(
    "/request-password-reset",
    validateBody(requestPasswordResetValidation),
    asyncHandler(AuthController.requestPasswordReset)
);

router.post(
    "/reset-password",
    validateBody(resetPasswordValidation),
    asyncHandler(AuthController.resetPassword)
);

router.post(
    "/change-password",
    asyncHandler(authenticate),
    validateBody(changePasswordValidaton),
    asyncHandler(AuthController.changePassword)
);

export default router;
