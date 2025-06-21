import express from "express";

import asyncHandler from "@/middleware/asyncHandler";
import authenticate from "@/middleware/authenticate";
import { isAdmin } from "@/middleware/authorize";

import { reviewController } from "@/review";

import productController from "./product.controller";

const router = express.Router();

router.get("/autocomplete", asyncHandler(productController.autoCompleteSearchQuery));
router.get("/search", asyncHandler(productController.searchProducts));
router.get("/:id", asyncHandler(productController.getProductById));
router.get("/", asyncHandler(productController.getAllProducts));

router.post("/:id/review", asyncHandler(authenticate), asyncHandler(reviewController.createReview));

router.post(
    "/",
    asyncHandler(authenticate),
    isAdmin,
    asyncHandler(productController.createProduct)
);

router.put("/:id/review", asyncHandler(authenticate), asyncHandler(reviewController.updateReview));

router.put(
    "/:id",
    asyncHandler(authenticate),
    isAdmin,
    asyncHandler(productController.updateProduct)
);

router.patch(
    "/:id/review",
    asyncHandler(authenticate),
    asyncHandler(reviewController.updateReview)
);

router.patch(
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

export default router;
