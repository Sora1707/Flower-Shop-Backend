import { Router } from "express";

import asyncHandler from "@/middleware/asyncHandler.middelware";
import authenticate from "@/middleware/authenticate.middelware";
import { isAdmin } from "@/middleware/authorize.middleware";

import { validateBody } from "@/middleware/validate.middelware";
import { updateCartItemQuantityValidation } from "./cart.validation";

import cartController from "./cart.controller";

const router = Router();

router.use(asyncHandler(authenticate));

router.get("/", asyncHandler(cartController.getUserCart));

router.patch(
    "/items/:productId",
    validateBody(updateCartItemQuantityValidation),
    asyncHandler(cartController.updateItemQuantity.bind(cartController))
);

// TODO delete item
router.delete("/items/:productId", asyncHandler(cartController.removeItemFromCartByProductId));
// TODO clear cart
router.delete("/items", asyncHandler(cartController.clearCart));

export default router;
