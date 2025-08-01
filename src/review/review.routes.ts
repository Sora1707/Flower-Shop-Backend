import { Router } from "express";

import asyncHandler from "@/middleware/asyncHandler.middelware";
import authenticate from "@/middleware/authenticate.middelware";
import { isAdmin } from "@/middleware/authorize.middleware";

import reviewController from "./review.controller";

const router = Router();

router.get("/", asyncHandler(authenticate), isAdmin, asyncHandler(reviewController.getAllReviews));

export default router;
