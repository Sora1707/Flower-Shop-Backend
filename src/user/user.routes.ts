import { Router } from "express";

import asyncHandler from "@/middleware/asyncHandler.middelware";
import authenticate from "@/middleware/authenticate.middelware";
import { validateBody } from "@/middleware/validate.middelware";

import { uploadAvatar } from "@/config/upload";

import UserController from "@/user/user.controller";
import { userAddressValidation, userAddCardValidation } from "./user.validation";

const router = Router();

router.use(asyncHandler(authenticate));

router.get("/me", asyncHandler(UserController.getCurrentUser));

/* PROFILE */
router.get("/profile", asyncHandler(UserController.getUserProfile));
router.patch("profile", asyncHandler(UserController.updateUserProfile));

router.patch(
    "/avatar",
    uploadAvatar.single("avatar"),
    asyncHandler(UserController.updateCurrentUser)
);

/* ADDRESS */
router.get("/address", asyncHandler(UserController.getUserAddresses));

router.post(
    "/address",
    validateBody(userAddressValidation),
    asyncHandler(UserController.addUserAddress)
);

router.patch("/address/:id/set-default", asyncHandler(UserController.setDefaultAddress));

router.patch("/address/:id", asyncHandler(UserController.updateUserAddress));

router.delete("/address/:id", asyncHandler(UserController.deleteUserAddress));

/* PAYMENT */
router.get("/payment", asyncHandler(UserController.getUserPayment));

router.post(
    "/payment",
    validateBody(userAddCardValidation),
    asyncHandler(UserController.addUserPayment)
);

router.patch("/payment/:id/set-default", asyncHandler(UserController.setDefaultPayment));

router.delete("/payment/:id", asyncHandler(UserController.deleteUserPayment));

router.get("/:id", asyncHandler(UserController.getUserProfileById));

export default router;
