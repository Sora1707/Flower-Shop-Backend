import { Router } from "express";

import asyncHandler from "@/middleware/asyncHandler";
import authenticate from "@/middleware/authenticate";
import { isAdmin } from "@/middleware/authorize";

import { orderController } from "@/order";

const router = Router();

// Order
router.get("/", asyncHandler(authenticate), isAdmin, asyncHandler(orderController.getAllOrders));
router.get("/:id", asyncHandler(authenticate), asyncHandler(orderController.getOrderById));
router.patch("/:id", asyncHandler(authenticate), asyncHandler(orderController.updateOrder));

// router.delete(
//     "/:userId",
//     asyncHandler(authenticate),
//     asyncHandler(OrderController.deleteOrderByUserId)
// );
// router.delete("/:id", asyncHandler(authenticate), asyncHandler(OrderController.deleteOrderById));
// router.delete("/", asyncHandler(authenticate), asyncHandler(OrderController.deleteAllOrders));
export default router;
