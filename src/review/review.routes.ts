import { Router } from "express";

import asyncHandler from "@/middleware/asyncHandler";
import authenticate from "@/middleware/authenticate";
import { isAdmin } from "@/middleware/authorize";

import reviewController from "./review.controller";

const router = Router();

router.get("/", asyncHandler(authenticate), isAdmin, asyncHandler(reviewController.getAllReviews));

export default router;
