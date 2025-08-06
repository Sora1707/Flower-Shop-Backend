import { Router } from "express";

import adminOrderController from "./order.controller";

import asyncHandler from "@/middleware/asyncHandler.middelware";

const router = Router();

router.get("/", asyncHandler(adminOrderController.getOrders));

router.get("/:id", asyncHandler(adminOrderController.getOrderById));

router.patch("/:id", asyncHandler(adminOrderController.updateOrder));

export default router;
