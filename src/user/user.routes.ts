import { Router } from "express";

import asyncHandler from "@/middleware/asyncHandler.middelware";
import authenticate from "@/middleware/authenticate.middelware";
import { validateBody } from "@/middleware/validate.middelware";

import { uploadAvatar } from "@/config/upload";

import OrderController from "@/order/order.controller";
import ReviewController from "@/review/review.controller";
import UserController from "@/user/user.controller";
import { userAddressValidation, userAddCardValidation } from "./user.validation";

const router = Router();

router.get("/me", asyncHandler(authenticate), asyncHandler(UserController.getCurrentUser));

router.get("/profile", asyncHandler(authenticate), asyncHandler(UserController.getUserProfile));
router.get("/address", asyncHandler(authenticate), asyncHandler(UserController.getUserAddresses));
// router.get("/payment", asyncHandler(authenticate), asyncHandler(UserController.getUserPayment));

router.post(
    "/address",
    asyncHandler(authenticate),
    validateBody(userAddressValidation),
    asyncHandler(UserController.addUserAddress)
);

router.patch(
    "/address/:id/default",
    asyncHandler(authenticate),
    asyncHandler(UserController.setDefaultAddress)
);

router.patch(
    "/address/:id",
    asyncHandler(authenticate),
    asyncHandler(UserController.updateUserAddress)
);

router.put(
    "/address/:id",
    asyncHandler(authenticate),
    asyncHandler(UserController.updateUserAddress)
);

router.delete(
    "/address/:id",
    asyncHandler(authenticate),
    asyncHandler(UserController.deleteUserAddress)
);

router.get("/payment", asyncHandler(authenticate), asyncHandler(UserController.getUserPayment));

router.post(
    "/payment",
    asyncHandler(authenticate),
    validateBody(userAddCardValidation),
    asyncHandler(UserController.addUserPayment)
);

router.delete(
    "/payment/:id",
    asyncHandler(authenticate),
    asyncHandler(UserController.deleteUserPayment)
);

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

export default router;
