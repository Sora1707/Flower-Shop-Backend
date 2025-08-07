import { Router } from "express";

import asyncHandler from "@/middleware/asyncHandler.middelware";
import authenticate from "@/middleware/authenticate.middelware";

import { reviewController } from "@/review";

import productController from "./product.controller";
import { validateBody } from "@/middleware/validate.middelware";
import { reviewValidation } from "@/review/review.validation";

const router = Router();

// TODO Move to search
router.get("/autocomplete", asyncHandler(productController.autoCompleteSearchQuery));

router.get("/search", asyncHandler(productController.searchProducts));

//
router.get("/:id", asyncHandler(productController.getProductById));

router.get("/", asyncHandler(productController.getProducts));

export default router;
