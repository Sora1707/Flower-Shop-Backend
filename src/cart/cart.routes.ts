import { Router } from "express";

import asyncHandler from "@/middleware/asyncHandler.middelware";
import authenticate from "@/middleware/authenticate.middelware";
import { isAdmin } from "@/middleware/authorize.middleware";

import { validateBody } from "@/middleware/validate.middelware";
import { UpdateCartItemQuantityValidation } from "./cart.validation";

import cartController from "./cart.controller";
import orderController from "@/order/order.controller";
import { OrderCreateValidation } from "@/order/order.validation";

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
// Frontend
router.post("/checkout", asyncHandler(authenticate), validateBody(OrderCreateValidation), asyncHandler(orderController.createOrder));
// router.put("/", asyncHandler(authenticate), asyncHandler(cartController.addItem));

router.patch("/", asyncHandler(authenticate), asyncHandler(cartController.updateItemQuantity)); // Frontend
// router.delete("/:productId", asyncHandler(authenticate), asyncHandler(cartController.removeItem));
// router.delete("/", asyncHandler(authenticate), asyncHandler(cartController.clearCart));
// router.delete(
//     "/:userId",
//     asyncHandler(authenticate),
//     asyncHandler(cartController.deleteCartByUserId)
// );

export default router;
