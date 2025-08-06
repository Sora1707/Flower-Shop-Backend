import { Router } from "express";

import asyncHandler from "@/middleware/asyncHandler.middelware";
import authenticate from "@/middleware/authenticate.middelware";
import { isAdmin } from "@/middleware/authorize.middleware";

import { validateBody } from "@/middleware/validate.middelware";
import { updateCartItemQuantityValidation } from "./cart.validation";

import cartController from "./cart.controller";

const router = Router();

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
    validateBody(updateCartItemQuantityValidation),
    asyncHandler(cartController.updateItemQuantity.bind(cartController))
);

// TODO delete item
// router.delete("/:productId", asyncHandler(authenticate), asyncHandler(cartController.removeItem));
// TODO clear cart
// router.delete("/", asyncHandler(authenticate), asyncHandler(cartController.clearCart));

export default router;
