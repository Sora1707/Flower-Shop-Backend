import { Router } from "express";

import asyncHandler from "@/middleware/asyncHandler.middelware";
import authenticate from "@/middleware/authenticate.middelware";
import { isAdmin } from "@/middleware/authorize.middleware";

import OrderController from "./order.controller";

const router = Router();

// Order
// TODO: Get user's orders

router.get("/:id", asyncHandler(authenticate), isAdmin, asyncHandler(OrderController.getOrderById));

router.post("/", asyncHandler(authenticate), asyncHandler(OrderController.createOrder));

// router.delete(
//     "/:userId",
//     asyncHandler(authenticate),
//     asyncHandler(OrderController.deleteOrderByUserId)
// );
// router.delete("/:id", asyncHandler(authenticate), asyncHandler(OrderController.deleteOrderById));
// router.delete("/", asyncHandler(authenticate), asyncHandler(OrderController.deleteAllOrders));
export default router;
