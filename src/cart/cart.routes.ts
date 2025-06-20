import { Router } from "express";
import asyncHandler from "@/middleware/asyncHandler";
import cartController from "./cart.controller";
import authenticate from "@/middleware/authenticate";

const router = Router();


router.get("/", asyncHandler(authenticate), asyncHandler(cartController.getCart)); 
router.get("/all", asyncHandler(authenticate), asyncHandler(cartController.getAllCart)); // update isAdmin
router.get("/:userId", asyncHandler(cartController.getCartByUserId)); // update isAdmin

router.put("/", asyncHandler(authenticate), asyncHandler(cartController.updateItemQuantity)); // Frontend

router.delete("/:productId", asyncHandler(authenticate), asyncHandler(cartController.removeItem)); 
router.delete("/", asyncHandler(authenticate), asyncHandler(cartController.clearCart)); 
router.delete("/:userId", asyncHandler(authenticate), asyncHandler(cartController.deleteCartByUserId));  // update isAdmin

export default router;