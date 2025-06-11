import express from "express";
import UserController from "@/user/user.controller";
import asyncHandler from "@/middleware/asyncHandler";

const router = express.Router();

router.post("/register", asyncHandler(UserController.register));
router.post("/login", asyncHandler(UserController.login));
router.get("/:id", asyncHandler(UserController.getUserById));

// router.post("/request-password-reset", asyncHandler(UserController.requestPasswordReset));
// router.post("/reset-password", asyncHandler(UserController.resetPassword));

export default router;
