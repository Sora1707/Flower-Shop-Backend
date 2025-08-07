import { Router } from "express";

import adminReviewController from "./review.controller";

import asyncHandler from "@/middleware/asyncHandler.middelware";
import { validateBody } from "@/middleware/validate.middelware";

const router = Router();

router.get("/:reviewId", asyncHandler(adminReviewController.getReviewById));

router.delete("/:reviewId", asyncHandler(adminReviewController.deleteReviewById));

router.get("/", asyncHandler(adminReviewController.getReviews));

router.get("/product/:productId", asyncHandler(reviewController.getReviewsForProduct));

router.get("/user/:userId/:productId", asyncHandler(reviewController.getUserReviewForProduct));

router.get("/user/:userId", asyncHandler(reviewController.getUserReviews));

// TODO Change review status

export default router;
