import express from "express";
import UserController from "@/user/user.controller";
import asyncHandler from "@/middleware/asyncHandler";
import authenticate from "@/middleware/authenticate";

const router = express.Router();

router.get("/me", asyncHandler(authenticate), asyncHandler(UserController.getCurrentUser)); // Assuming getCurrentUser is defined in UserController
router.get("/:id", asyncHandler(UserController.getUserById));
router.get("/", asyncHandler(UserController.getAllUsers));

router.post("/login", asyncHandler(UserController.login));
router.post("/register", asyncHandler(UserController.register));
// router.post("/request-password-reset", asyncHandler(UserController.requestPasswordReset));
// router.post("/reset-password", asyncHandler(UserController.resetPassword));

router.put("/:id", asyncHandler(authenticate), asyncHandler(UserController.updateUser));

router.delete("/:id", asyncHandler(authenticate), asyncHandler(UserController.deleteUser));

export default router;
