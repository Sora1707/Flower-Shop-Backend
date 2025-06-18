import express from "express";
import asyncHandler from "@/middleware/asyncHandler";
import productController from "./product.controller";
import cartController from "@/cart/cart.controller";

const router = express.Router();

router.get("/search", asyncHandler(productController.searchProducts)); // before getProductId
router.get("/:id", asyncHandler(productController.getProductById));
router.get("/", asyncHandler(productController.getAllProducts));

// For tetsing only, need to be updated later
router.post("/", asyncHandler(productController.createProduct));
router.post("/cart", asyncHandler(cartController.addOrUpdateItem));

router.put("/:id", asyncHandler(productController.updateProduct));

router.delete("/:id", asyncHandler(productController.deleteProduct));

// Handle adding item into cart

// For admin only
// router.post("/", authenticate, authorize(["admin"]), productController.create);
// router.put("/:id", authenticate, authorize(["admin"]), productController.updateProduct);
// router.delete("/:id", authenticate, authorize(["admin"]), productController.deleteProduct);

export default router;
