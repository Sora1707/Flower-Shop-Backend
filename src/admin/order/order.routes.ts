import { Router } from "express";

import adminOrderController from "./order.controller";

import asyncHandler from "@/middleware/asyncHandler.middelware";

const router = Router();

router.get("/user/:userId", asyncHandler(adminOrderController.getUserOrders));

router.get("/:orderId", asyncHandler(adminOrderController.getOrderById));

// TODO Update order: status
router.patch("/:orderId/status", asyncHandler(adminOrderController.updateOrderStatus));
router.patch("/:orderId/delivered-at", asyncHandler(adminOrderController.updateOrderDeliveredAt));

router.get("/", asyncHandler(adminOrderController.getOrders));

// TODO Cancel
// TODO Refund

export default router;
