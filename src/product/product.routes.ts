import express from "express";

import asyncHandler from "@/middleware/asyncHandler";
import authenticate from "@/middleware/authenticate";
import { isAdmin } from "@/middleware/authorize";

import { reviewController } from "@/review";

import productController from "./product.controller";

const router = express.Router();

router.get("/autocomplete", asyncHandler(productController.autoCompleteSearchQuery));
router.get("/search", asyncHandler(productController.searchProducts)); // before getProductId
router.get("/:id", asyncHandler(productController.getProductById));
router.get("/", asyncHandler(productController.getAllProducts));

// For tetsing only, need to be updated later
router.post("/:productId/cart", asyncHandler(authenticate), asyncHandler(cartController.addOrUpdateItem));
router.post("/", asyncHandler(authenticate), asyncHandler(productController.createProduct));

router.put("/:id", asyncHandler(authenticate), asyncHandler(productController.updateProduct));

router.delete("/:id", asyncHandler(authenticate), asyncHandler(productController.deleteProduct));

export default router;
