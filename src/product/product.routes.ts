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

router.post("/:id/review", asyncHandler(authenticate), asyncHandler(reviewController.createReview));
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
