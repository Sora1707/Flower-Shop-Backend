import { Router } from "express";
import asyncHandler from "@/middleware/asyncHandler.middelware";
import authenticate from "@/middleware/authenticate.middelware";
import { isAdmin } from "@/middleware/authorize.middleware";
import priceRuleController from "./priceRule.controller";
import { validateBody } from "@/middleware/validate.middelware";
import { PriceRuleCreateValidation, PriceRuleUpdateValidation } from "./priceRule.validation";

const router = Router();

// router.use(authenticate);
// router.use(isAdmin);

router.get("/all", asyncHandler(priceRuleController.getAll));
router.get("/:id", asyncHandler(priceRuleController.getById));
router.post(
    "/",
    validateBody(PriceRuleCreateValidation), 
    asyncHandler(priceRuleController.create));
router.patch(
    "/:id",
    validateBody(PriceRuleUpdateValidation), 
    asyncHandler(priceRuleController.update));
router.delete("/:id", asyncHandler(priceRuleController.delete));

export default router;
