import express from "express";

import productController from "./product.controller";
import cartController from "@/cart/cart.controller";

import asyncHandler from "@/middleware/asyncHandler";
import authenticate from "@/middleware/authenticate";
import { isAdmin } from "@/middleware/authorize";

const router = express.Router();

router.get("/autocomplete", asyncHandler(productController.autoCompleteSearchQuery));
router.get("/search", asyncHandler(productController.searchProducts)); // before getProductId
router.get("/:id", asyncHandler(productController.getProductById));
router.get("/", asyncHandler(productController.getAllProducts));

// For tetsing only, need to be updated later
router.post("/cart", asyncHandler(authenticate), asyncHandler(cartController.addOrUpdateItem));
router.post(
    "/",
    asyncHandler(authenticate),
    isAdmin,
    asyncHandler(productController.createProduct)
);

router.put(
    "/:id",
    asyncHandler(authenticate),
    isAdmin,
    asyncHandler(productController.updateProduct)
);

router.delete(
    "/:id",
    asyncHandler(authenticate),
    isAdmin,
    asyncHandler(productController.deleteProduct)
);

// Handle adding item into cart

// For admin only
// router.post("/", authenticate, authorize(["admin"]), productController.create);
// router.put("/:id", authenticate, authorize(["admin"]), productController.updateProduct);
// router.delete("/:id", authenticate, authorize(["admin"]), productController.deleteProduct);

export default router;
