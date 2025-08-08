import { Router } from "express";

import adminReviewController from "./review.controller";

import asyncHandler from "@/middleware/asyncHandler.middelware";
import { validateBody } from "@/middleware/validate.middelware";

const router = Router();

router.get("/product/:productId", asyncHandler(adminReviewController.getReviewsForProduct));

router.get("/user/:userId/:productId", asyncHandler(adminReviewController.getUserReviewForProduct));

router.get("/user/:userId", asyncHandler(adminReviewController.getUserReviews));

router.get("/:reviewId", asyncHandler(adminReviewController.getReviewById));

router.delete("/:reviewId", asyncHandler(adminReviewController.deleteReviewById));

router.get("/", asyncHandler(adminReviewController.getReviews));

// TODO Change review status

export default router;
