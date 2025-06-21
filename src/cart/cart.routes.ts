import { Router } from "express";

import asyncHandler from "@/middleware/asyncHandler";
import authenticate from "@/middleware/authenticate";
import { isAdmin } from "@/middleware/authorize";

import cartController from "./cart.controller";
import orderController from "@/order/order.controller";

const router = Router();

router.get("/all", asyncHandler(authenticate), isAdmin, asyncHandler(cartController.getAllCarts));
router.get(
    "/:userId",
    asyncHandler(authenticate),
    isAdmin,
    asyncHandler(cartController.getCartByUserId)
);
router.get("/", asyncHandler(authenticate), asyncHandler(cartController.getUserCart));

router.post("/checkout", asyncHandler(authenticate), asyncHandler(orderController.createOrder));

router.put("/", asyncHandler(authenticate), asyncHandler(cartController.updateItemQuantity));

router.patch("/", asyncHandler(authenticate), asyncHandler(cartController.updateItemQuantity));
// router.delete("/:productId", asyncHandler(authenticate), asyncHandler(cartController.removeItem));
// router.delete("/", asyncHandler(authenticate), asyncHandler(cartController.clearCart));
// router.delete(
//     "/:userId",
//     asyncHandler(authenticate),
//     asyncHandler(cartController.deleteCartByUserId)
// );

export default router;
