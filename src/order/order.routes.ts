import { Router } from "express";

import asyncHandler from "@/middleware/asyncHandler.middelware";
import authenticate from "@/middleware/authenticate.middelware";

import OrderController from "./order.controller";

const router = Router();

router.use(asyncHandler(authenticate));

router.get("/:id", asyncHandler(OrderController.getUserOrderById));

router.get("/", asyncHandler(OrderController.getUserOrders));

router.post("/", asyncHandler(OrderController.createOrder));

// TODO: request cancel order

export default router;
