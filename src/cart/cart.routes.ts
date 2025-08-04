import { Router } from "express";

import asyncHandler from "@/middleware/asyncHandler.middelware";
import authenticate from "@/middleware/authenticate.middelware";
import { isAdmin } from "@/middleware/authorize.middleware";

import { validateBody } from "@/middleware/validate.middelware";
import { UpdateCartItemQuantityValidation } from "./cart.validation";

import cartController from "./cart.controller";

const router = Router();

router.get("/all", asyncHandler(authenticate), isAdmin, asyncHandler(cartController.getAllCarts));
router.get(
    "/:userId",
    asyncHandler(authenticate),
    isAdmin,
    asyncHandler(cartController.getCartByUserId)
);
router.get("/", asyncHandler(authenticate), asyncHandler(cartController.getUserCart));

router.patch(
    "/",
    asyncHandler(authenticate),
    validateBody(UpdateCartItemQuantityValidation),
    asyncHandler(cartController.updateItemQuantity.bind(cartController))
);

// router.delete("/:productId", asyncHandler(authenticate), asyncHandler(cartController.removeItem));
// router.delete("/", asyncHandler(authenticate), asyncHandler(cartController.clearCart));
// router.delete(
//     "/:userId",
//     asyncHandler(authenticate),
//     asyncHandler(cartController.deleteCartByUserId)
// );

export default router;
