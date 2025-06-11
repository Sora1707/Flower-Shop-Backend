import express from "express";
import { Request, Response, NextFunction } from "express";
import asyncHandler from "@/middleware/asyncHandler";
import productController from "./product.controller";


const router = express.Router();

router.get("/", asyncHandler(productController.getAllProducts));
router.get("/:id", asyncHandler(productController.getProductById));

// For tetsing only, need to update later
router.post("/", asyncHandler(productController.createProduct));
router.put("/:id", asyncHandler(productController.updateProduct));
router.delete("/:id", asyncHandler(productController.deleteProduct));

// For admin only
// router.post("/", authenticate, authorize(["admin"]), productController.create);
// router.put("/:id", authenticate, authorize(["admin"]), productController.updateProduct);
// router.delete("/:id", authenticate, authorize(["admin"]), productController.deleteProduct);


export default router;