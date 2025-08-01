import { Router } from "express";
import asyncHandler from "@/middleware/asyncHandler";
import authenticate from "@/middleware/authenticate";
import { isAdmin } from "@/middleware/authorize";
import priceRuleController from "./priceRule.controller";

const router = Router();

// router.use(authenticate);
// router.use(isAdmin);

router.get("/all", asyncHandler(priceRuleController.getAll));
router.get("/:id", asyncHandler(priceRuleController.getById));
router.post("/", asyncHandler(priceRuleController.create));
router.patch("/:id", asyncHandler(priceRuleController.update));
router.delete("/:id", asyncHandler(priceRuleController.delete));

export default router;
