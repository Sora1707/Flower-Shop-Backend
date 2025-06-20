import { Router } from "express";
import asyncHandler from "@/middleware/asyncHandler";
import OrderController from "./order.controller";
import authenticate from "@/middleware/authenticate";

const router = Router();

// Order
router.get("/all", asyncHandler(authenticate), asyncHandler(OrderController.getAllOrders)); 
router.get("/:id", asyncHandler(authenticate), asyncHandler(OrderController.getOrderById)); // update isAdmin

router.delete("/:userId", asyncHandler(authenticate), asyncHandler(OrderController.deleteOrderByUserId)); // update isAdmin
router.delete("/:id", asyncHandler(authenticate), asyncHandler(OrderController.deleteOrderById));  // update isAdmin
router.delete("/", asyncHandler(authenticate), asyncHandler(OrderController.deleteAllOrders)); // update isAdmin
export default router;