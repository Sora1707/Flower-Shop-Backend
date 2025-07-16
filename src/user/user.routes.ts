import { Router } from "express";

import asyncHandler from "@/middleware/asyncHandler";
import authenticate from "@/middleware/authenticate";
import { isAdmin } from "@/middleware/authorize";
import { validateBody } from "@/middleware/validate";

import { uploadAvatar } from "@/config/upload";

import OrderController from "@/order/order.controller";
import ReviewController from "@/review/review.controller";
import UserController from "@/user/user.controller";
import { UserLoginValidation, UserRegisterValidation } from "./user.validation";

const router = Router();

router.get("/me", asyncHandler(authenticate), asyncHandler(UserController.getCurrentUser));
router.get(
    "/order/:orderId",
    asyncHandler(authenticate),
    asyncHandler(OrderController.getUserOrderById)
);
router.get("/order", asyncHandler(authenticate), asyncHandler(OrderController.getUserOrders));
router.get(
    "/review/:productId",
    asyncHandler(authenticate),
    asyncHandler(ReviewController.getUserReviewForProduct)
);
router.get("/review", asyncHandler(authenticate), asyncHandler(ReviewController.getUserReviews));
router.get("/:id", asyncHandler(UserController.getUserById));
router.get("/", asyncHandler(authenticate), isAdmin, asyncHandler(UserController.getAllUsers));

router.post("/login", validateBody(UserLoginValidation), asyncHandler(UserController.login));
router.post(
    "/register",
    validateBody(UserRegisterValidation),
    asyncHandler(UserController.register)
);

router.post("/request-password-reset", asyncHandler(UserController.requestPasswordReset));
router.post("/reset-password", asyncHandler(UserController.resetPassword));
router.post(
    "/change-password",
    asyncHandler(authenticate),
    asyncHandler(UserController.changePassword)
);

router.put(
    "/me",
    asyncHandler(authenticate),
    uploadAvatar.single("avatar"),
    asyncHandler(UserController.updateCurrentUser)
);
router.patch(
    "/me",
    asyncHandler(authenticate),
    uploadAvatar.single("avatar"),
    asyncHandler(UserController.updateCurrentUser)
);

router.delete("/me", asyncHandler(authenticate), asyncHandler(UserController.deleteCurrentUser));
router.delete("/:id", asyncHandler(authenticate), isAdmin, asyncHandler(UserController.deleteUser));

export default router;
