import { Router } from "express";

import asyncHandler from "@/middleware/asyncHandler";
import authenticate from "@/middleware/authenticate";
import { isAdmin } from "@/middleware/authorize";

import { reviewController } from "@/review";

import productController from "./product.controller";
import { validateBody } from "@/middleware/validate";
import { ProductCreateValidation } from "./product.validation";
import { ReviewValidation } from "@/review/review.validation";

const router = Router();

router.get("/autocomplete", asyncHandler(productController.autoCompleteSearchQuery));
router.get("/search", asyncHandler(productController.searchProducts));
router.get("/:id/review", asyncHandler(reviewController.getProductReviews));
router.get("/:id", asyncHandler(productController.getProductById));
router.get("/", asyncHandler(productController.getAllProducts));

router.post(
    "/:id/review", 
    asyncHandler(authenticate), 
    validateBody(ReviewValidation),
    asyncHandler(reviewController.createReview));

router.post(
    "/",
    asyncHandler(authenticate),
    isAdmin,
    validateBody(ProductCreateValidation),
    asyncHandler(productController.createProduct)
);

router.put(
    "/:id/review", 
    asyncHandler(authenticate), 
    // validateBody(ReviewValidation),
    asyncHandler(reviewController.updateReview));

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
