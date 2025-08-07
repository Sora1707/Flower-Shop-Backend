import { Router } from "express";

import adminProductController from "./product.controller";
import { productCreateValidation } from "./product.validation";

import asyncHandler from "@/middleware/asyncHandler.middelware";
import { validateBody } from "@/middleware/validate.middelware";

const router = Router();

router.post(
    "/",
    validateBody(productCreateValidation),
    asyncHandler(adminProductController.createProduct)
);

router.patch("/:id", asyncHandler(adminProductController.updateProduct));

router.delete("/:id", asyncHandler(adminProductController.deleteProduct));

// TODO Product avatar

export default router;
