import { Router } from "express";

import adminProductController from "./product.controller";
import { productCreateValidation, productUpdateValidation } from "./product.validation";

import asyncHandler from "@/middleware/asyncHandler.middelware";
import { validateBody } from "@/middleware/validate.middelware";

const router = Router();

router.patch(
    "/:productId",
    validateBody(productUpdateValidation),
    asyncHandler(adminProductController.updateProduct)
);

router.delete("/:productId", asyncHandler(adminProductController.deleteProduct));

router.post(
    "/",
    validateBody(productCreateValidation),
    asyncHandler(adminProductController.createProduct)
);

// TODO Product avatar

export default router;
