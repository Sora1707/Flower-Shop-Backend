import { Router } from "express";

import asyncHandler from "@/middleware/asyncHandler.middelware";
import authenticate from "@/middleware/authenticate.middelware";

import reviewController from "./review.controller";

const router = Router();

router.use(asyncHandler(authenticate));

router.get("/product/:productId", asyncHandler(reviewController.getReviewsForProduct));

router.post("/product/:productId", asyncHandler(reviewController.createReviewForProduct));

router.get("/user/:productId", asyncHandler(reviewController.getUserReviewForProduct));

router.get("/user", asyncHandler(reviewController.getUserReviews));

router.get("/:reviewId", asyncHandler(reviewController.getReviewById));

router.patch("/:reviewId", asyncHandler(reviewController.updateReviewById));

router.delete("/:reviewId", asyncHandler(reviewController.deleteReviewById));

export default router;
