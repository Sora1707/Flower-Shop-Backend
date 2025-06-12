import { Router } from "express";
import asyncHandler from "@/middleware/asyncHandler";
import cartController from "./cart.controller";

const router = Router();

// Cart
router.post("/users/:userId/carts", asyncHandler(cartController.create));
router.get("/users/:userId/carts", asyncHandler(cartController.getCart)); 
router.delete("/users/:userId/carts", asyncHandler(cartController.deleteOneCart)); 
router.delete("/users/:userId/carts/all", asyncHandler(cartController.deleteAllCarts)); 

// Cart Item
router.put("/users/:userId/carts/items", asyncHandler(cartController.addOrUpdateItem)); 
router.put("/users/:userId/carts/items/:productId", asyncHandler(cartController.updateItemQuantity));
router.delete("/users/:userId/carts/items/:productId", asyncHandler(cartController.removeItem)); 

export default router;