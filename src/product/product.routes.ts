import { Router } from "express";

import asyncHandler from "@/middleware/asyncHandler.middelware";
import authenticate from "@/middleware/authenticate.middelware";

import { reviewController } from "@/review";

import productController from "./product.controller";
import { validateBody } from "@/middleware/validate.middelware";
import { reviewValidation } from "@/review/review.validation";

const router = Router();

router.get("/autocomplete", asyncHandler(productController.autoCompleteSearchQuery));
router.get("/search", asyncHandler(productController.searchProducts));
router.get("/:id/review", asyncHandler(reviewController.getProductReviews));
router.get("/:id", asyncHandler(productController.getProductById));
router.get("/", asyncHandler(productController.getAllProducts));

router.post(
    "/:id/review",
    asyncHandler(authenticate),
    validateBody(reviewValidation),
    asyncHandler(reviewController.createReview)
);

router.put(
    "/:id/review",
    asyncHandler(authenticate),
    // validateBody(reviewValidation),
    asyncHandler(reviewController.updateReview)
);

router.patch(
    "/:id/review",
    asyncHandler(authenticate),
    asyncHandler(reviewController.updateReview)
);

export default router;
