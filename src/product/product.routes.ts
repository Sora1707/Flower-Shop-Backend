import { Router } from "express";

import asyncHandler from "@/middleware/asyncHandler.middelware";
import authenticate from "@/middleware/authenticate.middelware";

import productController from "./product.controller";
import { validateQuery } from "@/middleware/validate.middelware";
import { productRequestQuery } from "./product.validation";

const router = Router();

router.get("/autocomplete", asyncHandler(productController.autoCompleteSearchQuery));

router.get("/search", asyncHandler(productController.searchProducts));

router.get("/flower", asyncHandler(productController.getFlowers));

router.get("/vase", asyncHandler(productController.getVases));

router.get("/:productId", asyncHandler(productController.getProductById));

router.get("/", validateQuery(productRequestQuery), asyncHandler(productController.getProducts));

export default router;