import { Router } from "express";

import asyncHandler from "@/middleware/asyncHandler.middelware";
import authenticate from "@/middleware/authenticate.middelware";
import { validateBody } from "@/middleware/validate.middelware";

import { uploadAvatar } from "@/config/upload";

import UserController from "@/user/user.controller";
import {
    userAddressValidation,
    userAddCardValidation,
    userUpdateAddressValidation,
    userUpdateProfileValidation,
} from "./user.validation";

const router = Router();

router.get("/me", asyncHandler(authenticate), asyncHandler(UserController.getCurrentUser));

/* PROFILE */
router.get("/profile", asyncHandler(authenticate), asyncHandler(UserController.getUserProfile));

router.patch(
    "/profile",
    asyncHandler(authenticate),
    validateBody(userUpdateProfileValidation),
    asyncHandler(UserController.updateUserProfile)
);

/* AVATAR */
router.patch(
    "/avatar",
    asyncHandler(authenticate),
    uploadAvatar.single("avatar"),
    asyncHandler(UserController.updateUserAvatar)
);

/* ADDRESS */
router.get("/address", asyncHandler(authenticate), asyncHandler(UserController.getUserAddresses));

router.post(
    "/address",
    asyncHandler(authenticate),
    validateBody(userAddressValidation),
    asyncHandler(UserController.addUserAddress)
);

router.patch(
    "/address/:id/set-default",
    asyncHandler(authenticate),
    asyncHandler(UserController.setDefaultAddress)
);

router.patch(
    "/address/:id",
    asyncHandler(authenticate),
    validateBody(userUpdateAddressValidation),
    asyncHandler(UserController.updateUserAddress)
);

router.delete(
    "/address/:id",
    asyncHandler(authenticate),
    asyncHandler(UserController.deleteUserAddress)
);

/* PAYMENT */
router.get("/payment", asyncHandler(authenticate), asyncHandler(UserController.getUserPayment));

router.post(
    "/payment",
    asyncHandler(authenticate),
    validateBody(userAddCardValidation),
    asyncHandler(UserController.addUserPayment)
);

router.patch(
    "/payment/:id/set-default",
    asyncHandler(authenticate),
    asyncHandler(UserController.setDefaultPayment)
);

router.delete(
    "/payment/:id",
    asyncHandler(authenticate),
    asyncHandler(UserController.deleteUserPayment)
);

router.get("/:id", asyncHandler(UserController.getUserProfileById));

export default router;
